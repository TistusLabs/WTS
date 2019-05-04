import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Itinerary} from '../../data/itinerary.model';
import {ToasterService} from 'angular2-toaster';
import {BookingService} from '../../services/booking.service';
import {Profile, Profile_} from '../../data/user.model';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../services/auth.service';
import * as moment from 'moment';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ItineraryService} from '../../services/itinerary.service';

declare let StripeCheckout;
@Component({
    selector: 'app-itinerary-book',
    templateUrl: './itinerary-book.component.html',
    styleUrls: ['./itinerary-book.component.scss']
})
export class ItineraryBook implements OnInit {

    itinerary: Itinerary;
    user: Profile_;
    bookingTabs = [{
        number: 1,
        title: 'Tour Details',
        active: true,
        done: false
    }, {
        number: 2,
        title: `Traveller's Details`,
        active: false,
        done: false
    }, {
        number: 3,
        title: 'Payment & Submit',
        active: false,
        done: false
    }];
    bookingDone = false;
    bookingPaused = false;
    activeBookingStep = 0;
    form_invalid = false;
    bookingPayload = {
        number_of_travellers_prev: 1,
        payment: {
            payment_type: 'card'
        }
    };
    summary = {
        adults: {
            count: 0,
            subtotal: 0
        },
        children: {
            count: 0,
            subtotal: 0
        },
        total: 0
    };
    checkingOut = false;

    constructor(public dialogRef: MatDialogRef<ItineraryBook>,
                private toastr: ToasterService,
                private userService: UserService,
                private authService: AuthService,
                private bookingService: BookingService,
                private itineraryService: ItineraryService,
                private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: Itinerary
    ) {
        this.itinerary = this.data['data'];
    }

    ngOnInit() {
        const user = this.authService.getAuthenticatedUser();
        this.getProfileInfo(user['username']);
    }

    getProfileInfo (profileID) {
        this.togglePreload(true);
        this.userService.getProfile(profileID)
            .subscribe(profile => {
                if (profile['IsSuccess']) {
                    this.user = profile['Data'];
                    // this.bookingPayload.travellers[0].first_name = this.user.fname;
                    // this.bookingPayload.travellers[0].last_name = this.user.lname;
                    // this.bookingPayload.travellers[0].address_line_1 = this.user.address;
                    // this.bookingPayload.setProfileDisabled = true;
                    this.togglePreload(false);
                }
            });
    }

    onNoClick(): void {
        this.data = null;
        this.dialogRef.close();
    }

    continueBooking() {
        if (this.activeBookingStep !== this.bookingTabs.length) {
            for (const {s, i} of this.bookingTabs.map((s, i) => ({ s, i })) ) {
                s.active = false;
                if ((i - 1) === this.activeBookingStep) {
                    s.active = true;
                }
                if (i === this.activeBookingStep) {
                    s.done = true;
                }
            }
            this.activeBookingStep++;
        }

        if (this.activeBookingStep === this.bookingTabs.length) {
            if (this.bookingPayload.payment.payment_type === 'card') {
                this.StripeInit(this.itinerary.title);
            } else if (this.bookingPayload.payment.payment_type === 'WTX') {

            }
        }
    }

    goBackBooking() {
        if (this.activeBookingStep === this.bookingTabs.length) {this.activeBookingStep--;}
        if (this.activeBookingStep !== 0) {
            for (const {s, i} of this.bookingTabs.map((s, i) => ({ s, i })) ) {
                s.active = false;
                if ((i + 1) === this.activeBookingStep) {
                    s.active = true;
                }
            }
            this.activeBookingStep--;
        }
    }

    StripeInit(itinerary) {
        this.bookingPaused = true;
        const _self = this;
        const handler = StripeCheckout.configure({
            key: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
            image: 'https://wtsing.herokuapp.com/assets/worldtrip_singapore.png',
            locale: 'auto',
            token: function(token) {
                _self.bookingPaused = false;
                _self.bookingDone = true;
            }
        });

        handler.open({
            name: 'Stripe.com',
            description: '2 widgets',
            zipCode: true,
            amount: 2000
        });

        // Close Checkout on page navigation:
        window.addEventListener('popstate', function() {
            _self.bookingPaused = false;
            handler.close();
        });
    }

    submitTravellerInfo () {
        // this.checkOutBooking(this.itinerary);
    }

    downloadBookingReceipt() {

    }
    togglePreload(val) {
        this.bookingPaused = val;
    }
    forwardBooking (e) {
        this.togglePreload(false);
        this.summary.adults.count = this.itineraryService.getRecentBooking().count;
        this.summary.adults.subtotal = this.itinerary.price_adult * this.summary.adults.count;
        this.summary.children.count = this.itineraryService.getRecentBooking().count;
        this.summary.children.subtotal = this.itinerary.price_child * this.summary.children.count;
        this.continueBooking();
    }

    printBookingReceipt() {
        window.print();
    }

}
