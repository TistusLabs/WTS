import {FederatedUser} from 'aws-sdk/clients/sts';

declare const Buffer;
import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject, Observable, throwError} from 'rxjs';
import AWS from 'aws-sdk/global';
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
    CognitoUserSession
} from 'amazon-cognito-identity-js';

import {AuthUser, FederatedUserModel, User} from '../data/user.model';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {ToasterService} from 'angular2-toaster';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/internal/operators';
import { MessageService } from './message.service';
import { debug } from 'util';

const urls = {
    // country : 'https://json.geoiplookup.io/api',
    country : 'https://json.geoiplookup.io/api',
    geocode : 'https://maps.googleapis.com/maps/api/geocode/json?',
    countryCodes : 'assets/countrycodes.json'
};
const IDENTITY_POOL_ID = 'us-east-2:be9aa792-b112-456b-9f91-0a9a99cd7961';
const POOL_DATA = {
    UserPoolId: 'us-east-2_TzwFGMfr5',
    ClientId: '7adv02bn3463bhu558eelrthsr'
};
const userPool = new CognitoUserPool(POOL_DATA);
AWS.config.region = 'us-east-2';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    authIsLoading = new BehaviorSubject<boolean>(false);
    authDidFail = new BehaviorSubject<boolean>(false);
    authDidSuccess = new BehaviorSubject<boolean>(false);
    authConfirmOn = new BehaviorSubject<boolean>(false);
    authStatusChanged = new Subject<boolean>();
    registeredUser: CognitoUser;
    feduser = {
        accessKeyId : '',
        secretAccessKey : '',
        sessionToken : ''
    };
    public token = new Subject<number>();

    constructor(
        private http: HttpClient,
        private router: Router,
        private toasterService: ToasterService,
        private msgService: MessageService
) { }

    private emitToken(val) {
        this.token.next(val);
    }
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    }
    broadcastToken() {
        const token = localStorage.getItem('access_token');
        if (token) {
            this.emitToken(true);
        } else {
            this.emitToken(false);
        }
    }
    signUpFB_init (accessToken) {
        debugger
        // Add the Facebook access token to the Cognito credentials login map.
        const t = accessToken;
        const _self = this;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IDENTITY_POOL_ID,
            Logins: {
                'graph.facebook.com': accessToken
            }
        });

        // Obtain AWS credentials
        AWS.config.credentials['get'](function(err) {
            if (err) {
                _self.authDidFail.next(true);
                _self.authIsLoading.next(false);
                console.log(err);
                _self.toasterService.pop('error', 'Login with Facebook failed', 'Please try again later');
            } else {
                _self.feduser.accessKeyId = AWS.config.credentials.accessKeyId;
                _self.feduser.secretAccessKey = AWS.config.credentials.secretAccessKey;
                _self.feduser.sessionToken = AWS.config.credentials.sessionToken;

                _self.authStatusChanged.next(true);
                _self.authDidFail.next(false);
                _self.authDidSuccess.next(true);
                _self.authIsLoading.next(false);
            }
        });
    }
    signUpGoogle_init (gUser) {
        // Add the Google access token to the Cognito credentials login map.
        const _self = this;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: IDENTITY_POOL_ID,
            Logins: {
                'accounts.google.com': gUser['Zi']['id_token']
            }
        });

        // Obtain AWS credentials
        AWS.config.credentials['get'](function(err) {
            if (err) {
                _self.authDidFail.next(true);
                _self.authIsLoading.next(false);
                console.log(err);
                _self.toasterService.pop('error', 'Login with Google failed', 'Please try again later');
            } else {
                _self.feduser.accessKeyId = AWS.config.credentials.accessKeyId;
                _self.feduser.secretAccessKey = AWS.config.credentials.secretAccessKey;
                _self.feduser.sessionToken = AWS.config.credentials.sessionToken;

                _self.authStatusChanged.next(true);
                _self.authDidFail.next(false);
                _self.authDidSuccess.next(true);
                _self.authIsLoading.next(false);
            }
        });
    }
    signUp(email: string, password: string, mobile: string): void {
        this.authIsLoading.next(true);
        const user: AuthUser = {
            email: email,
            password: password,
            mobile: mobile
        };
        const attrList: CognitoUserAttribute[] = [];
        const emailAttribute = {
            Name: 'phone_number',
            Value: user.mobile
        };
        attrList.push(new CognitoUserAttribute(emailAttribute));
        userPool.signUp(user.email, user.password, attrList, null, (err, result) => {
            if (err) {
                this.authDidFail.next(true);
                this.authIsLoading.next(false);
                for (const m of err.message.split(';')) {
                    // debugger
                    this.toasterService.pop('error', 'Invalid inputs', m);
                }
                return;
            }
            this.authDidFail.next(false);
            this.authConfirmOn.next(true);
            this.authIsLoading.next(false);
            this.registeredUser = result.user;
        });
        return;
    }
    confirmUser(username: string, code: string) {
        this.authIsLoading.next(true);
        const userData = {
            Username: username,
            Pool: userPool
        };
        const cognitUser = new CognitoUser(userData);
        const that = this;
        cognitUser.confirmRegistration(code, true, (err, result) => {
            if (err) {
                this.authDidFail.next(true);
                this.authIsLoading.next(false);
                return;
            }
            // debugger;
            that.authStatusChanged.next(true);
            that.authDidFail.next(false);
            that.authDidSuccess.next(true);
            that.authIsLoading.next(false);
            that.toasterService.pop('success', 'Welcome!', 'You have successfully signed up with Worldtrip Singapore');
            // that.router.navigate(['/profile']);
        });
    }
    signIn(username: string, password: string): void {
        // debugger
        this.authIsLoading.next(true);
        const authData = {
            Username: username,
            Password: password
        };
        const authDetails = new AuthenticationDetails(authData);
        const userData = {
            Username: username,
            Pool: userPool
        };
        const cognitoUser = new CognitoUser(userData);
        const that = this;
        cognitoUser.authenticateUser(authDetails, {
            onSuccess(result: CognitoUserSession) {
                that.authStatusChanged.next(true);
                that.authDidFail.next(false);
                that.authDidSuccess.next(true);
                that.authIsLoading.next(false);
                //that.router.navigate(['/profile']);
                that.router.navigate(['/']);
                console.log(result);
            },
            onFailure(err) {
                that.authDidFail.next(true);
                that.authIsLoading.next(false);
                console.log(err);
                for (const m of err.message.split(';')) {
                    // debugger
                    that.toasterService.pop('error', 'Invalid inputs', m);
                }
            }
        });
        this.authStatusChanged.next(true); // create user with cognito data
        return;
    }
    getAuthenticatedUser = () => {
        return userPool.getCurrentUser();
    }
    getFedUser = () => {
        const checkProperties = () => {
            for (const key in this.feduser) {
                if (this.feduser[key] !== null || this.feduser[key] !== '') { return false; }
            }
            return this.feduser;
        };
        return checkProperties();
    }
    getIdToken = () => {
        const user = this.getAuthenticatedUser();
        const _self = this;
        let token;
        if (user) {
            user.getSession(function(err, session) {
                if (err) {
                    _self.toasterService.pop('error', 'Invalid user!', 'Please log in again');
                    _self.router.navigateByUrl('/auth');
                }
                token = session.getIdToken().getJwtToken();
            });
            // const flag = 'CognitoIdentityServiceProvider.' + user['pool'].clientId + '.' + user['username'];
            // const _config = user['storage'];
            // return _config[flag + '.idToken'];
        }
        return token;
    }
    logout() {
        this.getAuthenticatedUser().signOut();
        this.msgService.broadcast('userloggedout', true);
        this.authStatusChanged.next(false);
        this.router.navigateByUrl('/auth/signin');
    }
    isAuthenticated(): Observable<boolean> {
        // debugger
        const user = this.getAuthenticatedUser();
        const obs = Observable.create((observer) => {
            if (!user) {
                observer.next(false);
            } else {
                if (user != null) {
                    user.getSession(function(err, session) {
                        if (err) {
                            observer.next(false);
                        }
                        observer.next(true);
                    });
                }
            }
            observer.complete();
        });
        return obs;
    }
    initAuth() {
        this.isAuthenticated().subscribe(
            (auth) => this.authStatusChanged.next(auth)
        );
    }

    // Gerlocation
    getCountry (lat, lon) {
        return this.http.get(urls.geocode + 'latlng=' + lat + ',' + lon + '&key=AIzaSyCzZfydejAbwOMqsqcubkDLUX0k6aHkU8A')
            .pipe(
                catchError(this.handleError)
            );
    }
    getCountryCode () {
        return this.http.get(urls.countryCodes)
            .pipe(
                catchError(this.handleError)
            );
    }
}
