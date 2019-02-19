import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ItineraryService} from '../services/itinerary.service';
import {Itinerary} from '../data/itinerary.model';
import {ToasterService} from 'angular2-toaster';

declare let google;

@Component({
    selector: 'app-agent-itinerary',
    templateUrl: './agent-itinerary.component.html',
    styleUrls: ['./agent-itinerary.component.scss']
})
export class AgentItineraryComponent implements OnInit {
    itinerary: Itinerary;
    loading = false;

    constructor(private itineraryService: ItineraryService,
                private toastr: ToasterService) {
    }

    ngOnInit() {
        this.itinerary = this.itineraryService.getItinerary();
        const myLatlng = new google.maps.LatLng(1.3521, 103.8198);
        const mapOptions = {
            zoom: 12,
            center: myLatlng
        };
        const map = new google.maps.Map(document.getElementById('wts-itinerary-map'), mapOptions);

        // Place a draggable marker on the map
        const marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            draggable: true,
            title: 'Drag me!'
        });
        window.scrollTo(0, 0);
    }

    initMap() {

    }

    makePublic() {
        this.loading = true;
        const _payload = this.itinerary;
        _payload.is_public = true;
        this.itineraryService.editItinerary(_payload)
            .subscribe(
                res => {
                    // debugger;
                    this.loading = false;
                    this.toastr.pop('success', 'Make Public', 'Successfully made public.');
                },
                error => {
                    // debugger;
                    this.loading = false;
                    this.toastr.pop('error', 'My Itineraries', 'Failed to make public.');
                });
    }

}

