import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-wts-image-grid',
    template: `<div class="wts-image-grid" fxLayout="row wrap">
        <div class="wts-image-grid-image" *ngFor="let image of images">
            <img src="{{image}}" alt="event.date">
        </div>
    </div>`,
    styleUrls: ['./wts_image_grid.scss']
})
export class ImageGridComponent {
    @Input() images;
}
