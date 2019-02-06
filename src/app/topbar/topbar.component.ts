import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

    user = {
        logged : false
    };

    constructor(
        private router: Router,
        private authServide: AuthService
    ) {
    }

    ngOnInit() {
        // this.authServide.token.subscribe(token => {
        //     // debugger;
        //     if (token) this.user.logged = true;
        // });
        const user = this.authServide.getAuthenticatedUser();
        if (user) {
            this.user.logged = true;
        }
        this.authServide.authDidSuccess
            .subscribe((didSuccess: boolean) => {
                if (didSuccess) {
                    // debugger
                    this.user.logged = true;
                }
            });
    }

    joinUser () {
        this.router.navigateByUrl('/auth');
    }

    userAccount () {
        this.router.navigateByUrl('/account');
    }

    goToHome() {
        this.router.navigateByUrl('/');
    }

    navigateTo(_route) {
        this.router.navigateByUrl('/' + _route);
    }

    logOut () {
        this.authServide.logout();
        this.user.logged = false;
    }

}
