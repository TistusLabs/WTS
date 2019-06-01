import { Component, Inject, OnInit, ChangeDetectionStrategy, AfterViewChecked } from '@angular/core';
import * as $ from 'jquery';
import 'slick-carousel';
import { ActivatedRoute, Router } from '@angular/router';
import { ItineraryService } from '../services/itinerary.service';
import { Itinerary } from '../data/itinerary.model';
import { ToasterService } from 'angular2-toaster';
import { MatDialog } from '@angular/material';
import { ItineraryBook } from './itinerary-book/itinerary-book.component';
import { CreateItinerary } from '../agent-itineraries/agent-itineraries.component';
import { CalendarEvent, CalendarMonthViewBeforeRenderEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { addDays } from 'date-fns';
import { DayViewHour } from 'calendar-utils';
import { UserService } from '../services/user.service';

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
    view: CalendarView = CalendarView.Month;
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
    activeDayIsOpen: boolean = true;
    isOwner = false;

    constructor(private itineraryService: ItineraryService,
        private toastr: ToasterService,
        private userService : UserService,
        private router: Router,
        public dialog: MatDialog) {
        const i = this.itineraryService.getItinerary();
        if (!i) { this.router.navigateByUrl('/search'); }
    }

    ngOnInit() {
        this.initFunctionality();

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

        $(document).ready(() => {
            const galwidth = $('#wts-itinerary-gal').width();
            $('.slider-for').slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                fade: true,
                centerMode: true,
                asNavFor: '.slider-nav'
            });
            $('.slider-nav').slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                asNavFor: '.slider-for',
                dots: false,
                centerMode: true,
                autoplaySpeed: 2000,
                focusOnSelect: true,
                variableWidth: true
            });
            $('.slider-for').css({
                width: (galwidth)
            });
            $('.slider-nav').css({
                width: (galwidth)
            });
        });
    }

    initFunctionality(){
        this.itinerary = this.itineraryService.getItinerary();
        if (!this.itinerary) { this.router.navigateByUrl('/search'); }

        // check ownership
        const profile = this.userService.getCurrentUserProfile();
        if (profile) {
            if(this.itinerary["userId"] == profile["userId"]){
                this.isOwner = true;
            }
        }
    }
    ngAfterViewChecked() {

    }
    initMap() {

    }
    initGal() {

    }
    requestToBook(itinerary) {
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

    viewProfile(guideInfo){
        this.router.navigateByUrl('/profile/' + guideInfo.userId);
    }

    deleteItinerary() {
        debugger
        this.loading = true;
        this.itineraryService.deleteItinerary(this.itinerary["itinerary_id"])
            .subscribe(
                res => {
                    // debugger;
                    this.loading = false;
                    this.toastr.pop('success', 'Success', 'Successfully deleted itinerary.');
                    this.router.navigateByUrl('/itineraries')
                },
                error => {
                    // debugger;
                    this.loading = false;
                    this.toastr.pop('error', 'Error', 'Failed to delete itinerary.');
                });
    }
    deleteConfirmation() {
        var r = confirm("Are you sure to remove this? This is cannot be undone!");
        if (r == true) {
            this.deleteItinerary();
        }
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
                    this.initFunctionality();
                },
                error => {
                    // debugger;
                    this.loading = false;
                    this.toastr.pop('error', 'My Itineraries', 'Failed to make public.');
                });
    }
    makePrivate() {
        debugger
        this.loading = true;
        const _payload = this.itinerary;
        this.itineraryService.markItineraryPrivate(_payload["itinerary_id"])
            .subscribe(
                res => {
                    // debugger;
                    this.loading = false;
                    this.toastr.pop('success', 'Make Public', 'Successfully made private.');
                    this.initFunctionality();
                },
                error => {
                    // debugger;
                    this.loading = false;
                    this.toastr.pop('error', 'My Itineraries', 'Failed to make private.');
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
        debugger
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
    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }
}

