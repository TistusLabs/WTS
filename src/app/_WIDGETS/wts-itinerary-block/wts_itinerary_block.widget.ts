import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component ({
    selector: 'app-wts-itinerary-block',
    templateUrl: './wts_itinerary_block.html',
    styleUrls: ['./wts_itinerary_block.scss']
})
export class ItineraryComponent {
    @Input() itinerary;
    @Output() click: EventEmitter<number> = new EventEmitter<number>();

    onClick() {
        this.click.emit();
    }
}
