import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import {Profile_} from '../data/user.model';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    summaryExpanded = false;
    activeSummaryTab = null;
    profile: Profile_ = null;

    constructor(public router: Router,
        private userService: UserService,
        private authService: AuthService
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
    }

    toggleSummary(s) {
        this.summaryExpanded = s;
    }

    goToProfile() {
        this.router.navigateByUrl('/profile');
    }

}
