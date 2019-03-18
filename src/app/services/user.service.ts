import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Profile } from '../data/user.model';
import { catchError, retry } from 'rxjs/internal/operators';
import { throwError, Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private msgService: MessageService
    ) {
        this.subscribe();
    }

    private subscription: Subscription;

    private urls = {
        'get_profile': 'https://fbmp1ug0m2.execute-api.us-east-2.amazonaws.com/dev/profile',
        'create_profile': 'https://fbmp1ug0m2.execute-api.us-east-2.amazonaws.com/dev/profile',
        'get_topguides': 'https://fbmp1ug0m2.execute-api.us-east-2.amazonaws.com/dev/guide/top',
        'get_profile_bulk': 'https://fbmp1ug0m2.execute-api.us-east-2.amazonaws.com/dev/profile/getbulk'
    };
    private requestParams;
    private requestOptions;
    public idToken = this.authService.getIdToken();
    private myProfile = null;
    homeUser = null;

    subscribe() {
        this.subscription = this.msgService.subscribe('userloggedout', (payload) => {
            this.myProfile = null;
        });

    }

    setHomeUser(user) {
        this.homeUser = user;
    }

    getHomeUser() {
        return this.homeUser;
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
    };

    getProfile(userID) {
        // debugger
        //const idToken = this.authService.getIdToken();
        const headers = {
            //'Authorization': idToken
        };

        this.requestParams = new HttpParams()
            .set('userId', userID);

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(headers)
        };

        return this.http.get<Profile>(this.urls.get_profile, this.requestOptions);
    }

    getProfilesBulk(list) {
        //debugger
        const headers = {
            'Content-Type': 'application/json'
        };

        this.requestOptions = {
            headers: new HttpHeaders(headers)
        };

        let payload = {
            "userIds": list
        }

        return this.http.post<Profile>(this.urls.get_profile_bulk, payload, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    createProfile(profile) {
        // debugger
        const idToken = this.authService.getIdToken();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': idToken
        };

        this.requestOptions = {
            headers: new HttpHeaders(headers)
        };

        return this.http.post<Profile>(this.urls.create_profile, profile, this.requestOptions)
            .pipe(
                retry(3),
                catchError(this.handleError)
            );
    }

    setCurrentUserProfile(profile) {
        this.myProfile = profile;
    }

    unsetCurrentUserProfile(){
        this.myProfile = null;
    }

    getCurrentUserProfile() {
        return this.myProfile;
    }

    getTopGuides() {
        const headers = {
            'Content-Type': 'application/json'
        };

        this.requestOptions = {
            headers: new HttpHeaders(headers)
        };

        return this.http.get<Array<Profile>>(this.urls.get_topguides, this.requestOptions)
            .pipe(
                catchError(this.handleError)
            );
    }
}
