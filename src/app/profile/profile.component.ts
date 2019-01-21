import {Component, OnInit, Inject} from '@angular/core';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {User} from '../data/user.model';

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

    user: User = {
        first_name: 'John',
        last_name: 'Doe',
        address : 'No 29, Hill Street, Colombo',
        interests : 'Singing',
        lifestyle: 'Simplicity',
        isVerified : true
    };
    constructor(private router: Router,
                public dialog: MatDialog) {
    }

    ngOnInit() {
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

}

// Edit Profile
@Component({
    selector: 'app-edit-profile',
    templateUrl: 'profile-edit.component.html',
})
export class EditProfile {

    constructor(public dialogRef: MatDialogRef<EditProfile>, @Inject(MAT_DIALOG_DATA) public data: User) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
