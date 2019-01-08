import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import { Itinerary } from '../data/itinerary.model';

@Injectable({
    providedIn: 'root'
})
export class ItineraryService {

    public itinerary = null;
    constructor(
        private router: Router
    ) { }

    private emitItinerary(itinerary) {
        this.itinerary = itinerary;
    }

    setItinerary(itinerary) {
        this.emitItinerary(itinerary);
    }

    getItinerary() {
        return this.itinerary;
    }
}
