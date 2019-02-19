import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Media} from '../data/media.model';
import {catchError} from 'rxjs/internal/operators';
import {throwError} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})

export class MediaService {
    private urls = {
        'uploadMedia' : 'https://fbmp1ug0m2.execute-api.us-east-2.amazonaws.com/dev/media'
    };
    private idToken = this.authService.getIdToken();
    private requestParams;
    private requestOptions;
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            // console.error(
            //     `Backend returned code ${error.status}, ` +
            //     `body was: ${error.error}`);
            return error;
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    }
    constructor(
        public http: HttpClient,
        public authService: AuthService
    ) {}

    uploadMedia (file, media, folder) {
        debugger
        const payload: Media = {
            "userId":"",
            "file_folder":"",
            "file_contentType":"",
            "file_name":"",
            "file_string" : ""
        }
        const user = this.authService.getAuthenticatedUser();
        payload['userId'] = user['username'];
        payload['file_folder'] = folder;
        payload['file_contentType'] = file.type;
        payload['file_name'] = file.name;
        payload['file_string'] = media.split(',').pop();

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': this.idToken
        };
        this.requestOptions = {
            headers: new HttpHeaders(headers)
        };
        return this.http.post<Media>(this.urls.uploadMedia, payload, this.requestOptions);
    }
}