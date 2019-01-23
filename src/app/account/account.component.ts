import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    summaryExpanded = false;
    activeSummaryTab = null;
    profile = {};

    constructor(public router: Router,
        private userService: UserService, 
        ) {}

    ngOnInit() {
        this.loadInformation();
    }

    loadInformation(){
        debugger
        this.profile = this.userService.getCurrentUserProfile();
    }

    activateSummaryTab (tab) {
        this.activeSummaryTab = tab;
        this.toggleSummary(true);
    }

    toggleSummary (s) {
        this.summaryExpanded = s;
    }

    goToProfile () {
        this.router.navigateByUrl('/profile');
    }

}
