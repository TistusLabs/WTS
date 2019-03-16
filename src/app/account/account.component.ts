import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import {Profile_} from '../data/user.model';
import { AuthService } from '../services/auth.service';
import {BookingService} from '../services/booking.service';
import {ToasterService} from 'angular2-toaster';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    summaryExpanded = false;
    activeSummaryTab = null;
    profile: Profile_ = null;
    myBookings = [];
    loading = false;

    constructor(public router: Router,
        private userService: UserService,
        private authService: AuthService,
        private bookingService: BookingService,
        private toastrService: ToasterService
    ) { }

    ngOnInit() {
        this.loadInformation();
    }

    loadInformation() {
        this.profile = this.userService.getCurrentUserProfile();
        if (this.profile == null) {
            const user = this.authService.getAuthenticatedUser();
            this.userService.getProfile(user['username'])
                .subscribe(profile => {
                    // debugger
                    if (profile['IsSuccess']) {
                        this.profile = profile['Data'];
                       // this.userService.setCurrentUserProfile(this.profile);
                    }
                });
        }
    }

    activateSummaryTab(tab) {
        this.activeSummaryTab = tab;
        this.toggleSummary(true);

        if (this.activeSummaryTab === 'bookings') this.myBookingsTab();
    }

    toggleSummary(s) {
        this.summaryExpanded = s;
    }

    myBookingsTab () {
        this.loading = true;
        this.bookingService.getAllBooking()
            .subscribe(
                res => {
                    if (res['IsSuccess']) {
                        this.loading = false;
                        this.myBookings = res['Data'];
                    } else {
                        this.loading = false;
                        this.toastrService.pop('error', 'My Bookings Failed', 'Failed to load My Bookings. Please try again later.');
                    }
                },
                erres => {
                    this.loading = false;
                    this.toastrService.pop('error', 'My Bookings Failed', 'Failed to load My Bookings. Please try again later.');
                });
    }

    goToProfile() {
        this.router.navigateByUrl('/profile');
    }

}
