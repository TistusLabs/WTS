import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-wts-event-block',
    template: `<div class="wts-event-block">
        <div class="wts-event-date">{{event.date}}</div>
        <div class="wts-event-description">{{event.description}}</div>
        <div class="wts-event-footages" fxLayout="row wrap">
            <app-wts-image-grid [images]="event.images"></app-wts-image-grid>
        </div>
    </div>`,
    styleUrls: ['./wts_event_block.scss']
})
export class EventBlockComponent {
    @Input() event;
}
