import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Profile, Profile_, User} from '../data/user.model';
import {UserService} from '../services/user.service';
import {any} from 'codelyzer/util/function';
import {ToasterService} from 'angular2-toaster';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    events = [
        {
            date: moment(new Date()).format('MMMM Do YYYY'),
            description: 'Bring my overseas friends to try Singapore Hawker food',
            images: [
                './assets/event/105066394-GettyImages-498350103_1.1910x1000.jpg',
                './assets/event/hokkien-mee-.jpg',
                './assets/event/mackenzie-rex-restaurant.jpg',
                './assets/event/singapore.jpg.jpg'
            ]
        },
        {
            date: moment(new Date()).format('MMMM Do YYYY'),
            description: 'Christmas shopping experience',
            images: [
                './assets/event/hokkien-mee-.jpg',
                './assets/event/mackenzie-rex-restaurant.jpg',
                './assets/event/105066394-GettyImages-498350103_1.1910x1000.jpg',
                './assets/event/singapore.jpg.jpg'
            ]
        }];

    // user: User = {
    //     first_name: 'John',
    //     last_name: 'Doe',
    //     address : 'No 29, Hill Street, Colombo',
    //     interests : 'Singing',
    //     lifestyle: 'Simplicity',
    //     isVerified : true
    // };

    user: Profile_ = {
        fname: '',
        tagline: '',
        type: 'traveller',
        interests: [],
        lifestyle: [],
        userId: '',
        address: '',
        lname: '',
        image_url: 'https://i.pinimg.com/236x/e1/26/15/e12615cb231c9ab8e41dd726649f999a--drawing-practice-figure-drawing.jpg'
    };

    constructor(private router: Router,
                private userService: UserService,
                private toasterService: ToasterService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
        // debugger
        this.userService.getProfile()
            .subscribe(profile => {
                // debugger
                if (profile['IsSuccess']) {
                    this.user = profile['Data'];
                } else {
                    this.openCreateProfile();
                }
            });
        // this.openCreateProfile();
    }

    goToItinerary() {
        this.router.navigateByUrl('/itineraries');
    }

    editProfile(): void {
        const dialogRef = this.dialog.open(EditProfile, {
            width: '60%',
            disableClose: true,
            data: this.user
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
            // this.animal = result;
        });
    }

    openCreateProfile(): void {
        const dialogRef = this.dialog.open(EditProfile, {
            width: '60%',
            disableClose: true,
            data: {
                title: 'Create your',
                guide: `Let's start with the basics`,
                data: this.user
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            debugger
            if (result) {
                this.userService.getProfile()
                    .subscribe(profile => {
                        // debugger
                        if (profile['IsSuccess']) {
                            this.user = profile['Data'];
                        }
                    });
            }
        });
    }

}

// Edit Profile
@Component({
    selector: 'app-edit-profile',
    templateUrl: 'profile-edit.component.html',
})
export class EditProfile implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<EditProfile>,
        @Inject(MAT_DIALOG_DATA) public data: Profile_,
        private toasterService: ToasterService,
        private userService: UserService
    ) {
    }

    profile: Profile;
    loading = false;

    ngOnInit() {
        this.profile = JSON.parse(JSON.stringify(this.data));
    }

    onNoClick(status): void {
        this.dialogRef.close(status);
    }

    addInterest(input): void {
        // debugger
        this.profile['data'].interests.push(input);
        document.getElementById('interests')['value'] = '';
        document.getElementById('interests').focus();
    }

    removeInterest(input): void {
        const i = this.profile['data'].interests.indexOf(input);
        this.profile['data'].interests.splice(i, 1);
    }

    addLifestyle(input): void {
        this.profile['data'].lifestyle.push(input);
        document.getElementById('lifestyle')['value'] = '';
        document.getElementById('lifestyle').focus();
    }

    removeLifestyle(input): void {
        const i = this.profile['data'].lifestyle.indexOf(input);
        this.profile['data'].lifestyle.splice(i, 1);
    }

    createProfile() {
        const payload = this.profile['data'];
        delete payload.profile_id;
        this.loading = true;
        this.userService.createProfile(payload)
            .subscribe(res => {
                if (res['IsSuccess']) {
                    this.onNoClick(true);
                    this.loading = false;
                    this.toasterService.pop('success', 'Profile created', 'You have successfully created your profile');
                }
            });
    }

}
