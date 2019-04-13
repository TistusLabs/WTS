import {Input, Component, OnInit} from '@angular/core';
import {ItineraryService} from '../../../services/itinerary.service';

@Component({
    'selector' : 'book-tour-finish',
    'templateUrl' : './book.tourfinish.html'
})
export class TourFinish implements OnInit{
    @Input() public itinerary;
    @Input() public summary;

    count = 0;
    price = 0;
    constructor(
        private itineraryService: ItineraryService
    ) {}

    ngOnInit() {
        this.count = this.itineraryService.getRecentBooking().count;
        this.price = this.itinerary.price;
        debugger
    }
}
