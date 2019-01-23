import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Profile} from '../data/user.model';
import {catchError, retry} from 'rxjs/internal/operators';
import {throwError} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})

export class UserService {
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}

    private urls = {
        'get_profile' : 'https://fbmp1ug0m2.execute-api.us-east-2.amazonaws.com/dev/profile',
        'create_profile' : 'https://fbmp1ug0m2.execute-api.us-east-2.amazonaws.com/dev/profile'
    };
    private requestParams;
    private requestOptions;
    private idToken = this.authService.getIdToken();
    private myProfile = null;

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

    getProfile () {
        // debugger
        const headers = {
            'Authorization': this.idToken
        };
        const user = this.authService.getAuthenticatedUser();
        this.requestParams = new HttpParams()
            .set('userId', user['username']);

        this.requestOptions = {
            params: this.requestParams,
            headers: new HttpHeaders(headers)
        };

        return this.http.get<Profile>(this.urls.get_profile, this.requestOptions);
    }

    setCurrentUserProfile(profile){
        this.myProfile = profile;
    }

    getCurrentUserProfile(){
        return this.myProfile;
    }

    createProfile (profile) {
        // debugger
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': this.idToken
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
}
