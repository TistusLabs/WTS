import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import {Profile_} from '../data/user.model';

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
    ) { }

    ngOnInit() {
        this.loadInformation();
    }

    loadInformation() {
        this.profile = this.userService.getCurrentUserProfile();
        if (this.profile == null) {
            this.userService.getProfile()
                .subscribe(profile => {
                    // debugger
                    if (profile['IsSuccess']) {
                        this.profile = profile['Data'];
                        this.userService.setCurrentUserProfile(this.profile);
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
