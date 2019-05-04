import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ItineraryService } from '../services/itinerary.service';
import { UserService } from '../services/user.service';
import { Itinerary } from '../data/itinerary.model';
import { ToasterService } from 'angular2-toaster';
import { MediaService } from '../services/media.service';
import { AuthService } from '../services/auth.service';
import { Profile_ } from '../data/user.model';
import { MessageService } from '../services/message.service';
declare let google;

@Component({
    selector: 'app-agent-itineraries',
    templateUrl: './agent-itineraries.component.html',
    styleUrls: ['./agent-itineraries.component.scss']
})
export class AgentItinerariesComponent implements OnInit {
    itinerary: Itinerary = {
        title: '',
        backdrop: '',
        description: '',
        activities: '',
        services: [],
        guest_type: '',
        guest_condition: '',
        price: 0,
        area: 'Singapore',
        tour_from: '',
        tour_to: '',
        notes: '',
        guide: {},
        is_public: false
    };
    itineraries = [{
        id: 'itinerary#1',
        backdrop: './assets/event/singapore.jpg.jpg',
        title: 'Historical Night Tour',
        description: 'Come with me on a night tour and I will immerse you in the history and current affairs of Singapore! I am a qualified Singapore tour guide with a special interest in culture',
        activities: 'Join me on a journey through Singapore from past to present. Explore the historic Civic District before',
        conditions: 'Guests aged 6 and up can attend',
        price: 129,
        services: [
            'Meal', 'Drinks', 'Ticket'
        ],
        area: 'Singapore',
        from: '4th January 2019',
        to: '10th January 2019',
        notes: 'You must be able to walk 6km to join this tour',
        guide: {
            name: 'Amelia',
            picture: './assets/user_female.jpg',
            stars: Array(3).fill(0).map((x, i) => i),
            rating: 5.0,
            languages: ['English', 'Mandarin']
        }
    }, {
        id: 'itinerary#2',
        backdrop: './assets/event/hokkien-mee-.jpg',
        title: 'Singapore Shopping Trip',
        description: 'Come with me on a night tour and I will immerse you in the history and current affairs of Singapore! I am a qualified Singapore tour guide with a special interest in culture',
        activities: 'Join me on a journey through Singapore from past to present. Explore the historic Civic District before',
        conditions: 'Guests aged 6 and up can attend',
        price: 59,
        services: [
            'Meal', 'Drinks', 'Ticket'
        ],
        area: 'Singapore',
        from: '4th January 2019',
        to: '10th January 2019',
        notes: 'You must be able to walk 6km to join this tour',
        guide: {
            name: 'Austin',
            picture: './assets/user_male.jpg',
            stars: Array(4).fill(0).map((x, i) => i),
            rating: 5.0,
            languages: ['English', 'Mandarin']
        }
    }];

    myitineraries = [];
    loading = false;
    profile = null;
    itemFlexSetter = 31;
    user: Profile_ = null;

    constructor(
        public dialog: MatDialog,
        private route: Router,
        private itineraryService: ItineraryService,
        public toastr: ToasterService,
        private userService: UserService,
        private authService: AuthService,
        private msgService: MessageService
    ) {
    }

    ngOnInit() {
        this.loadInformation();
    }

    loadInformation() {
        const profile = this.userService.getCurrentUserProfile();
        if (profile == null) {
            const user = this.authService.getAuthenticatedUser();
            this.getProfileInfo(user['username']);
        } else {
            this.user = profile;
            this.getAllItineraries();
        }
    }

    getProfileInfo(profileID) {
        this.userService.getProfile(profileID)
            .subscribe(profile => {
                if (profile['IsSuccess']) {
                    this.user = profile['Data'];
                    this.msgService.broadcast('profileObj', this.user);
                    this.getAllItineraries();
                }
            });
    }

    getAllItineraries() {
        this.loading = true;
        this.itineraryService.getMyItineraries()
            .subscribe(res => {
                this.myitineraries = res['Data'];
                if (this.myitineraries) {
                    for (const i_ of this.myitineraries) {
                        i_.guide = {
                            name: this.user.fname,
                            picture: this.user.image_url,
                            stars: Array(4).fill(0).map((x, i) => i),
                            rating: 5.0,
                            languages: ['English', 'Mandarin']
                        };
                    }
                } else {
                    this.toastr.pop('error', 'My Itineraries', 'Failed to load Itineraries');
                }
                this.loading = false;
            },
                error => {
                    this.toastr.pop('error', 'My Itineraries', 'Failed to load Itineraries');
                    this.loading = false;
                });
    }

    createItinerary(): void {
        const dialogRef = this.dialog.open(CreateItinerary, {
            width: '80%',
            disableClose: true,
            data: this.itinerary
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
            // this.animal = result;
            this.getAllItineraries();
        });
    }

    openItinerary(itinerary) {
        // debugger
        this.itineraryService.setItinerary(itinerary);
        this.route.navigateByUrl('/itinerary/' + itinerary.itinerary_id);
    }

}

/* Create itinerary
================================================================================================ */
@Component({
    selector: 'app-create-itinerary',
    templateUrl: 'agent-itinerary-create.component.html',
})
export class CreateItinerary implements OnInit {

    minDate = new Date();
    serviceInput = '';
    loading = false;
    imageFile = null;

    constructor(
        public dialogRef: MatDialogRef<CreateItinerary>,
        private itineraryService: ItineraryService,
        private toasterService: ToasterService,
        private mediaService: MediaService,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: Itinerary) {
    }


    ngOnInit() {
        const myLatlng = new google.maps.LatLng(1.3521, 103.8198);
        const mapOptions = {
            zoom: 12,
            center: myLatlng
        };
        const map = new google.maps.Map(document.getElementById('wts-itinerary-map'), mapOptions);

        // Place a draggable marker on the map
        const marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            draggable: true,
            title: 'Drag me!'
        });
    }

    onNoClick(): void {
        this.data = null;
        this.dialogRef.close();
    }

    addService(input): void {
        this.data['services'].push(input);
        document.getElementById('itineraryActivityInput')['value'] = '';
        document.getElementById('itineraryActivityInput').focus();
    }

    removeService(input): void {
        const i = this.data['services'].indexOf(input);
        this.data['services'].splice(i, 1);
    }

    handleProfileImage(files: FileList) {
        const reader = new FileReader();
        const _self = this;
        this.imageFile = files.item(0);
        reader.onload = function (e) {
            _self.data['backdrop'] = e.target['result'];
        };
        reader.readAsDataURL(files.item(0));
    }

    createInineraryInit(createItineraryForm) {
        if (createItineraryForm.valid) {
            const payload = this.data;
            const _self = this;
            // payload.backdrop = "https://static.businessinsider.sg/2018/03/st-singapore-supertrees-4113.jpg";
            this.loading = true;
            if (this.imageFile) {
                // debugger
                this.mediaService.uploadMedia(_self.imageFile, payload['backdrop'], 'itinerary')
                    .subscribe(media => {
                        payload.backdrop = media["Data"].Location;
                        _self.createItinerary(payload);
                    }, error => {
                        _self.loading = false;
                        _self.toasterService.pop('error', 'Itinerary', 'Failed to create itinerary. Please try again later.');
                    });
            } else {
                this.createItinerary(payload);
            }
        }
    }

    createItinerary(payload) {
        this.itineraryService.createItinerary(payload)
            .subscribe(res => {
                if (res['IsSuccess']) {
                    this.onNoClick();
                    this.toasterService.pop('success', 'Itinerary created', 'You have successfully created an Itinerary');
                    // this.router.navigateByUrl('/');
                }else{
                    this.toasterService.pop('error', 'Itinerary created failed', res["Message"]);
                    this.loading = false;
                }
            });
    }

}
/* --------------------------------------------------------------------------------------------- */
