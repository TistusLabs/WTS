import {Component, Input} from '@angular/core';

@Component({
    'selector' : 'book-tour-summary',
    'templateUrl' : './book.toursum.html'
})
export class TourSummary {
    @Input() private tourSummary;
}
