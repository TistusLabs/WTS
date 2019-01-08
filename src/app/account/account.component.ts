import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    summaryExpanded = false;
    activeSummaryTab = null;

    constructor(public router: Router ) {
    }

    ngOnInit() {
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
