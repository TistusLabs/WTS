import {Injectable} from '@angular/core';
import {Subject, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import { Itinerary } from '../data/itinerary.model';
import {Profile} from '../data/user.model';
import {catchError, retry} from 'rxjs/internal/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ItineraryService {

    public itinerary: Itinerary;
    constructor(
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) { }

    private urls = {
        'get_itinerary' : '',
        'get_all_itinerary' : 'https://fbmp1ug0m2.execute-api.us-east-2.amazonaws.com/dev/itinerary/all',
        'get_my_itinerary' : 'https://fbmp1ug0m2.execute-api.us-east-2.amazonaws.com/dev/itinerary/my',
        'create_itinerary' : 'https://fbmp1ug0m2.execute-api.us-east-2.amazonaws.com/dev/itinerary'
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
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };

    private emitItinerary(itinerary) {
        this.itinerary = itinerary;
    }

    setItinerary(itinerary) {
        this.emitItinerary(itinerary);
    }

    getItinerary() {
        return this.itinerary;
    }

    getAllItineraries() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': this.idToken
        };

        this.requestOptions = {
            headers: new HttpHeaders(headers)
        };

        return this.http.get<Array<Itinerary>>(this.urls.get_all_itinerary, this.requestOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    getMyItineraries() {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': this.idToken
        };

        this.requestOptions = {
            headers: new HttpHeaders(headers)
        };

        return this.http.get<Array<Itinerary>>(this.urls.get_my_itinerary, this.requestOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    createItinerary (itinerary) {
        // debugger
        const idToken = this.authService.getIdToken();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': idToken
        };

        this.requestOptions = {
            headers: new HttpHeaders(headers)
        };

        return this.http.post<Itinerary>(this.urls.create_itinerary, itinerary, this.requestOptions)
            .pipe(
                catchError(this.handleError)
            );
    }
}
