import {Component, Input, OnInit} from '@angular/core';

@Component ({
    selector: 'app-wts-rating-main',
    template: '<div class="wts-bnr-rating-main">\n' +
    '               <div class="wts-rating-info">\n' +
    // '                   <div class="wts-rate-info-service">\n' +
    // '                       Service Rating <b>({{service}})</b>\n' +
    // '                   </div>\n' +
    '                   <div class="wts-rate-info-stars">\n' +
    '                        <mat-icon *ngFor="let r of dummyCount" [ngClass]="ratingStarsHandler(r)">star</mat-icon>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '               <div class="wts-rating-val">\n' +
    '                     {{rating}}/ 5\n' +
    '               </div>\n' +
    '           </div>',
    styleUrls: ['./wts_rating_main.scss']
})
export class RatingMainComponent implements OnInit {
    @Input() rating;
    starRating: number;
    dummyCount: Array<Number> ;

    constructor() {}
    ngOnInit() {
        this.starRating = this.roundUp(this.rating, 1);
        this.dummyCount = [1, 2, 3, 4, 5];
    }

    roundUp (num, precision) {
        precision = Math.pow(10, precision);
        return Math.ceil(num * precision) / precision;
    }

    ratingStarsHandler (val) {
        if (val <= this.rating) return 'rated_full';
        else return '';
    }

}
