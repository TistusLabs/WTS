import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject, Observable} from 'rxjs';

import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
    CognitoUserSession
} from 'amazon-cognito-identity-js';

import {AuthUser, User} from '../data/user.model';
import {Router} from '@angular/router';

const POOL_DATA = {
    UserPoolId: 'us-east-2_TzwFGMfr5',
    ClientId: '7adv02bn3463bhu558eelrthsr'
};
const userPool = new CognitoUserPool(POOL_DATA);

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

    public token = new Subject<number>();
    constructor(
        private router: Router
    ) { }

    private emitToken(val) {
        this.token.next(val);
    }

    broadcastToken() {
        const token = localStorage.getItem('access_token');
        if (token) {
            this.emitToken(true);
        } else {
            this.emitToken(false);
        }
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
        cognitUser.confirmRegistration(code, true, (err, result) => {
            if (err) {
                this.authDidFail.next(true);
                this.authIsLoading.next(false);
                return;
            }
            debugger;
            this.authDidFail.next(false);
            this.authDidSuccess.next(true);
            this.authIsLoading.next(false);
            this.router.navigate(['/account']);
        });
    }

    signIn(username: string, password: string): void {
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
                that.router.navigate(['/account']);
                console.log(result);
            },
            onFailure(err) {
                that.authDidFail.next(true);
                that.authIsLoading.next(false);
                console.log(err);
            }
        });
        this.authStatusChanged.next(true); // create user with cognito data
        return;
    }

    getAuthenticatedUser() {
        return userPool.getCurrentUser();
    }

    logout() {
        this.getAuthenticatedUser().signOut();
        this.authStatusChanged.next(false);
    }

    isAuthenticated(): Observable<boolean> {
        const user = this.getAuthenticatedUser();
        const obs = Observable.create((observer) => {
            if (!user) {
                observer.next(false);
            } else {
                user.getSession((err, session) => {
                    if (err) {
                        observer.next(false);
                    } else {
                        if (session.isValid()) {
                            observer.next(true);
                        } else {
                            observer.next(false);
                        }
                    }
                });
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
}
