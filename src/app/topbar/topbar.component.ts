import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';
import { EditProfile } from '../profile/profile.component';
import { Profile_ } from '../data/user.model';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

    private subscription: Subscription;

    currentUser = {
        logged: false
    }
    user: Profile_ = {
        fname: '',
        tagline: '',
        profile_type: 'guest',
        interests: [],
        lifestyle: [],
        userId: '',
        address: '',
        lname: '',
        image_url: 'https://www.tripwishlist.com/Media/BLPhotos/dummy_user.png'
    };

    profile = {};
    private profileID;

    constructor(
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private msgService: MessageService,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private ref: ChangeDetectorRef
    ) {
        this.subscribe();
    }

    subscribe() {
        this.subscription = this.msgService.subscribe('profileObj', (payload) => {
            //debugger
            this.user = payload;
            this.currentUser.logged = true;
        });

    }

    ngOnInit() {
        //debugger
        const user = this.authService.getAuthenticatedUser();
        if (user) {
            this.currentUser.logged = true;
        }
        this.authService.authDidSuccess
            .subscribe((didSuccess: boolean) => {
                if (didSuccess) {
                    // debugger
                    this.currentUser.logged = true;
                }
            });

        this.tryGetProfile();
    }

    tryGetProfile() {
        const profile = this.userService.getCurrentUserProfile();
        if (profile == null) {
            const user = this.authService.getAuthenticatedUser();
            if (user != null) {
                this.getProfileInfo(user['username']);
            }
        } else {
            this.user = profile;
        }
    }

    getProfileInfo(profileID) {
        this.userService.getProfile(profileID)
            .subscribe(profile => {
                if (profile['IsSuccess']) {
                    this.user = profile['Data'];
                    this.currentUser.logged = true;
                    this.msgService.broadcast('profileObj', this.user);
                    this.userService.setCurrentUserProfile(this.user);
                } else {
                    this.openCreateProfile(false);
                }
            });
    }

    openCreateProfile(isEdit: boolean): void {
        const dialogRef = this.dialog.open(EditProfile, {
            width: '60%',
            disableClose: true,
            data: {
                title: isEdit ? 'Edit' : 'Create your',
                guide: isEdit ? '' : `Let's start with the basics`,
                data: this.user
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // debugger
            if (result) {
                const user = this.authService.getAuthenticatedUser();
                this.userService.getProfile(user['username'])
                    .subscribe(profile => {
                        // debugger
                        if (profile['IsSuccess']) {
                            this.user = profile['Data'];
                        }
                    });
            }
        });

        this.ref.detectChanges();
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
        this.authService.logout();
        this.currentUser.logged = false;
    }

}
