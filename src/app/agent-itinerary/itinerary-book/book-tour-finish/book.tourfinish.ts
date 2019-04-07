import { Input, Component } from '@angular/core';

@Component({
    'selector' : 'book-tour-finish',
    'templateUrl' : './book.tourfinish.html'
})
export class TourFinish {
    @Input() public itinerary;
    @Input() public summary;
};