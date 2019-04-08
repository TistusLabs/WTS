import {Component, Inject, OnInit, ChangeDetectionStrategy, AfterViewChecked} from '@angular/core';
import * as $ from 'jquery';
import 'slick-carousel';
import {ActivatedRoute, Router} from '@angular/router';
import {ItineraryService} from '../services/itinerary.service';
import {Itinerary} from '../data/itinerary.model';
import {ToasterService} from 'angular2-toaster';
import {MatDialog} from '@angular/material';
import {ItineraryBook} from './itinerary-book/itinerary-book.component';
import { CreateItinerary } from '../agent-itineraries/agent-itineraries.component';
import {CalendarEvent, CalendarMonthViewBeforeRenderEvent, CalendarMonthViewDay} from 'angular-calendar';
import { addDays } from 'date-fns';
import { DayViewHour } from 'calendar-utils';

declare let google;

@Component({
    selector: 'app-agent-itinerary',
    templateUrl: './agent-itinerary.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./agent-itinerary.component.scss']
})
export class AgentItineraryComponent implements OnInit, AfterViewChecked {
    itinerary: Itinerary;
    loading = false;
    viewDate: Date = new Date();
    today = new Date();
    tomorrow = this.today.setDate(this.today.getDate() + 1);
    dat = this.today.setDate(this.today.getDate() + 2);
    events: CalendarEvent[] = [];
    clickedColumn: number;
    selectedMonthViewDay: CalendarMonthViewDay;
    selectedDayViewDate: Date;
    selectedDays: any = [];
    dayView: DayViewHour[];

    constructor(private itineraryService: ItineraryService,
                private toastr: ToasterService,
                public dialog: MatDialog) {
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

        $('.slider-for').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            centerMode: true,
            asNavFor: '.slider-nav',
            autoplay: true
        });
        $('.slider-nav').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: '.slider-for',
            dots: false,
            centerMode: true,
            focusOnSelect: true
        });
    }
    ngAfterViewChecked() {
        // $(document).ready(() => {
            const galwidth = $('#wts-itinerary-gal').width();
            $('.slider-for').css({
                width : (galwidth)
            });
        // });
    }
    initMap() {

    }
    initGal() {

    }
    requestToBook (itinerary) {
        const dialogRef = this.dialog.open(ItineraryBook, {
            width: '70%',
            disableClose: true,
            data: {
                title: 'Book this Itinerary',
                data: itinerary
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // debugger
            if (result) {

            }
        });
    }
    makePublic() {
        debugger
        this.loading = true;
        const _payload = this.itinerary;
        this.itineraryService.markItineraryPublic(_payload["itinerary_id"])
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
    editItinerary(): void {
        const dialogRef = this.dialog.open(CreateItinerary, {
            width: '80%',
            disableClose: true,
            data: this.itinerary
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
            // this.animal = result;
        });
    }
    beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
        renderEvent.body.forEach(day => {
            const dayOfMonth = day.date.getDate();
            if (dayOfMonth > 5 && dayOfMonth < 10 && day.inMonth) {
                day.cssClass = 'cal-day-disabled';
            }
        });
    }
    dayClicked(day: CalendarMonthViewDay): void {
        this.selectedMonthViewDay = day;
        const selectedDateTime = this.selectedMonthViewDay.date.getTime();
        const dateIndex = this.selectedDays.findIndex(
            selectedDay => selectedDay.date.getTime() === selectedDateTime
        );
        if (dateIndex > -1) {
            delete this.selectedMonthViewDay.cssClass;
            this.selectedDays.splice(dateIndex, 1);
        } else {
            this.selectedDays.push(this.selectedMonthViewDay);
            day.cssClass = 'cal-day-selected';
            this.selectedMonthViewDay = day;
        }
    }
    // beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    //     body.forEach(day => {
    //         if (
    //             this.selectedDays.some(
    //                 selectedDay => selectedDay.date.getTime() === day.date.getTime()
    //             )
    //         ) {
    //             day.cssClass = 'cal-day-selected';
    //         }
    //     });
    // }

    hourSegmentClicked(date: Date) {
        this.selectedDayViewDate = date;
        this.addSelectedDayViewClass();
    }

    beforeDayViewRender(dayView: DayViewHour[]) {
        this.dayView = dayView;
        this.addSelectedDayViewClass();
    }

    private addSelectedDayViewClass() {
        this.dayView.forEach(hourSegment => {
            hourSegment.segments.forEach(segment => {
                delete segment.cssClass;
                if (
                    this.selectedDayViewDate &&
                    segment.date.getTime() === this.selectedDayViewDate.getTime()
                ) {
                    segment.cssClass = 'cal-day-selected';
                }
            });
        });
    }

}

