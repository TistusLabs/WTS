import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Profile, Profile_, User } from '../data/user.model';
import { UserService } from '../services/user.service';
import { any } from 'codelyzer/util/function';
import { ToasterService } from 'angular2-toaster';
import { MediaService } from '../services/media.service';
import { catchError } from 'rxjs/internal/operators';
import { ItineraryService } from '../services/itinerary.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

    private subscription: Subscription;
    loading = false;
    profile = null;
    myitineraries = [];
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

    profileID = "";

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
        profile_type: 'guest',
        interests: [],
        lifestyle: [],
        userId: '',
        address: '',
        lname: '',
        image_url: 'https://www.tripwishlist.com/Media/BLPhotos/dummy_user.png'
    };

    constructor(private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private authService: AuthService,
        private toasterService: ToasterService,
        private itineraryService: ItineraryService,
        private ref: ChangeDetectorRef,
        public dialog: MatDialog,
        private msgService: MessageService
    ) {
        
    }

    getProfileInfo(profileID) {
        this.userService.getProfile(profileID)
            .subscribe(profile => {
                if (profile['IsSuccess']) {
                    this.user = profile['Data'];
                    this.msgService.broadcast('profileObj', this.user);
                } else {
                    this.openCreateProfile(false);
                }
            });
    }

    ngOnInit() {
        debugger
        this.profileID = this.route.snapshot.paramMap.get("id")
        if (this.profileID == null) {
            const profile = this.userService.getCurrentUserProfile();
            if (profile == null) {
                const user = this.authService.getAuthenticatedUser();
                this.getProfileInfo(user['username']);
            } else {
                this.user = profile;
            }
        } else {
            this.getProfileInfo(this.profileID);
        }


        // this.ref.detectChanges();
        // this.getAllItineraries();
        // const data = this.userService.getHomeUser();
        // if (data) {
        //     this.user.fname = data['fname'];
        //     this.user.lname = data['lname'];
        //     this.user.tagline = data['tagline'];
        //     this.user.interests.values = data['interests'];
        //     this.user.lifestyle.values = data['lifestyle'];
        //     this.user.address = data['address'];
        //     this.user.image_url = data['image_url'];
        // } else {
        //     this.userService.getProfile()
        //         .subscribe(profile => {
        //             if (profile['IsSuccess']) {
        //                 this.user = profile['Data'];
        //                 this.userService.setCurrentUserProfile(this.user);
        //             } else {
        //                 this.openCreateProfile(false);
        //             }
        //         });
        //     // this.openCreateProfile();
        // }
    }

    ngOnDestroy() {
        //unsubscribe();
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

    getAllItineraries() {
        this.loading = true;
        this.itineraryService.getMyItineraries()
            .subscribe(res => {
                this.myitineraries = res['Data'];
                for (const i_ of this.myitineraries) {
                    i_.guide = {
                        name: this.profile.fname,
                        picture: './assets/user_male.jpg',
                        stars: Array(4).fill(0).map((x, i) => i),
                        rating: 5.0,
                        languages: ['English', 'Mandarin']
                    };
                }
                this.loading = false;
            },
                error => {
                    this.toasterService.pop('error', 'My Itineraries', 'Failed to load Itineraries');
                    this.loading = false;
                });
    }

}

// Edit Profile
@Component({
    selector: 'app-edit-profile',
    templateUrl: 'profile-edit.component.html',
})
export class EditProfile implements OnInit {

    constructor(public dialogRef: MatDialogRef<EditProfile>,
        @Inject(MAT_DIALOG_DATA) public data: Profile_,
        private toasterService: ToasterService,
        private mediaService: MediaService,
        private msgService: MessageService,
        private userService: UserService) {
    }

    profile: Profile;
    loading = false;
    fileToUpload: File = null;
    imageFile = null;

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

    handleProfileImage(files: FileList) {
        const reader = new FileReader();
        const _self = this;
        this.imageFile = files.item(0);
        reader.onload = function (e) {
            _self.profile['data'].image_url = e.target['result'];
        };
        reader.readAsDataURL(files.item(0));
    }

    createProfileInit() {
        const payload = this.profile['data'];
        delete payload.profile_id;
        this.loading = true;
        const _self = this;
        if (_self.imageFile) {
            _self.mediaService.uploadMedia(_self.imageFile, _self.profile['data'].image_url, 'profiles')
                .subscribe(media => {
                    debugger;
                    payload.image_url = media["Data"].Location;
                    this.createProfile(payload);
                }, error => {
                    this.loading = false;
                    this.toasterService.pop('error', 'Profile creation ', 'Failed to create profile. Please try again later.');
                });
        } else {
            this.createProfile(payload);
        }
    }

    createProfile(payload) {
        this.userService.createProfile(payload)
            .subscribe(res => {
                if (res['IsSuccess']) {
                    debugger;
                    this.onNoClick(true);
                    this.loading = false;
                    this.toasterService.pop('success', 'Profile created', 'You have successfully created your profile');
                    this.msgService.broadcast('profileObj', res['Data']);
                    this.userService.setCurrentUserProfile(res['Data']);
                } else {
                    this.loading = false;
                    this.toasterService.pop('error', 'Profile creation', 'Failed to create profile. Please try again later.');
                }
            });
    }

}
