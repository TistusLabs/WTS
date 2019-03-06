import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

    user = {
        logged: false
    };

    profile = {};

    constructor(
        private router: Router,
        private authServide: AuthService,
        private userService: UserService
    ) {
    }

    ngOnInit() {
        //debugger
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
        const data = this.userService.getCurrentUserProfile();
        if (data) {
            this.profile = data;
        } else {
            const user = this.authServide.getAuthenticatedUser();
            this.userService.getProfile(user['username'])
                .subscribe(profile => {
                    // debugger
                    if (profile['IsSuccess']) {
                        this.profile = profile['Data'];
                        //this.userService.setCurrentUserProfile(this.profile);
                    }
                });
        }
    }

    joinUser() {
        this.router.navigateByUrl('/auth');
    }

    userAccount() {
        this.router.navigateByUrl('/account');
    }

    goToHome() {
        this.router.navigateByUrl('/');
    }

    navigateTo(_route) {
        this.router.navigateByUrl('/' + _route);
    }

    logOut() {
        this.authServide.logout();
        this.user.logged = false;
    }

}
