import {Component, Input, OnInit} from '@angular/core';

@Component ({
    selector: 'app-wts-rating-overall',
    template: '<div class="wts-rating-overall">\n' +
    '                            <div class="wts-rating-bar-wrap">\n' +
    '                                <div class="wts-rating-bar-title">Review Summary</div>\n' +
    '                                <div class="wts-rating-bar-bar">\n' +
    '                                    <div class="wts-rating-bar-filled" [style.width.%]="summeryFill"></div>\n' +
    '                                </div>\n' +
    '                                <div class="wts-rating-bar-value">{{summery}}/5</div>\n' +
    '                            </div>\n' +
    '                            <div class="wts-rating-bar-wrap">\n' +
    '                                <div class="wts-rating-bar-title">Service</div>\n' +
    '                                <div class="wts-rating-bar-bar">\n' +
    '                                    <div class="wts-rating-bar-filled" [style.width.%]="serviceFill"></div>\n' +
    '                                </div>\n' +
    '                                <div class="wts-rating-bar-value">{{service}}/5</div>\n' +
    '                            </div>\n' +
    '                            <div class="wts-rating-bar-wrap">\n' +
    '                                <div class="wts-rating-bar-title">Organization</div>\n' +
    '                                <div class="wts-rating-bar-bar">\n' +
    '                                    <div class="wts-rating-bar-filled" [style.width.%]="organizationFill"></div>\n' +
    '                                </div>\n' +
    '                                <div class="wts-rating-bar-value">{{organization}}/5</div>\n' +
    '                            </div>\n' +
    '                            <div class="wts-rating-bar-wrap">\n' +
    '                                <div class="wts-rating-bar-title">Value for money</div>\n' +
    '                                <div class="wts-rating-bar-bar">\n' +
    '                                    <div class="wts-rating-bar-filled" [style.width.%]="vfmFill"></div>\n' +
    '                                </div>\n' +
    '                                <div class="wts-rating-bar-value">{{vfm}}/5</div>\n' +
    '                            </div>\n' +
    '                            <div class="wts-rating-bar-wrap">\n' +
    '                                <div class="wts-rating-bar-title">Safety</div>\n' +
    '                                <div class="wts-rating-bar-bar">\n' +
    '                                    <div class="wts-rating-bar-filled" [style.width.%]="safetyFill"></div>\n' +
    '                                </div>\n' +
    '                                <div class="wts-rating-bar-value">{{safety}}/5</div>\n' +
    '                            </div>\n' +
    '                        </div>',
    styleUrls: ['./wts_rating_overall.scss']
})
export class RatingOverallComponent implements OnInit{
    @Input() summery;
    @Input() service;
    @Input() organization;
    @Input() vfm;
    @Input() safety;

    summeryFill: number;
    serviceFill: number;
    organizationFill: number;
    vfmFill: number;
    safetyFill: number;

    constructor() {

    }

    ngOnInit() {
        this.summeryFill = ( this.summery / 5 * 100 );
        this.serviceFill = ( this.service / 5 * 100 );
        this.organizationFill = ( this.organization / 5 * 100 );
        this.vfmFill = ( this.vfm / 5 * 100 );
        this.safetyFill = ( this.safety / 5 * 100 );
    }
}
