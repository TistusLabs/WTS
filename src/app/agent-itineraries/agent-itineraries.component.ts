import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Router} from '@angular/router';
import {ItineraryService} from '../services/itinerary.service';
import { UserService } from '../services/user.service';
import {Itinerary} from '../data/itinerary.model';
import {ToasterService} from 'angular2-toaster';
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
        condition: '',
        price: 0,
        area: 'Singapore',
        from: '',
        to: '',
        notes: '',
        guide: {},
        is_public: false
    };
    itineraries = [{
        id : 'itinerary#1',
        backdrop : './assets/event/singapore.jpg.jpg',
        title : 'Historical Night Tour',
        description : 'Come with me on a night tour and I will immerse you in the history and current affairs of Singapore! I am a qualified Singapore tour guide with a special interest in culture',
        activities: 'Join me on a journey through Singapore from past to present. Explore the historic Civic District before',
        conditions: 'Guests aged 6 and up can attend',
        price : 129,
        services: [
            'Meal', 'Drinks', 'Ticket'
        ],
        area: 'Singapore',
        from: '4th January 2019',
        to: '10th January 2019',
        notes: 'You must be able to walk 6km to join this tour',
        guide : {
            name : 'Amelia',
            picture : './assets/user_female.jpg',
            stars : Array(3).fill(0).map((x, i) => i),
            rating : 5.0,
            languages: ['English', 'Mandarin']
        }
    }, {
        id : 'itinerary#2',
        backdrop : './assets/event/hokkien-mee-.jpg',
        title : 'Singapore Shopping Trip',
        description : 'Come with me on a night tour and I will immerse you in the history and current affairs of Singapore! I am a qualified Singapore tour guide with a special interest in culture',
        activities: 'Join me on a journey through Singapore from past to present. Explore the historic Civic District before',
        conditions: 'Guests aged 6 and up can attend',
        price : 59,
        services: [
            'Meal', 'Drinks', 'Ticket'
        ],
        area: 'Singapore',
        from: '4th January 2019',
        to: '10th January 2019',
        notes: 'You must be able to walk 6km to join this tour',
        guide : {
            name : 'Austin',
            picture : './assets/user_male.jpg',
            stars : Array(4).fill(0).map((x, i) => i),
            rating : 5.0,
            languages: ['English', 'Mandarin']
        }
    }];

    myitineraries = [];
    loading = false;
    profile = null;
    itemFlexSetter = 31;

    constructor(
        public dialog: MatDialog,
        private route: Router,
        private itineraryService: ItineraryService,
        public toastr: ToasterService,
        private userService: UserService,
    ) {
    }

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
                    this.getAllItineraries();
                });
        } else {
            this.getAllItineraries();
        }
    }

    getAllItineraries () {
        this.loading = true;
        this.itineraryService.getMyItineraries()
            .subscribe(res => {
                this.myitineraries = res['Data'];
                for (const i_ of this.myitineraries) {
                    i_.guide = {
                        name : this.profile.fname,
                        picture : './assets/user_male.jpg',
                        stars : Array(4).fill(0).map((x, i) => i),
                        rating : 5.0,
                        languages: ['English', 'Mandarin']
                    };
                }
                this.loading = false;
            },
            error => {
                this.toastr.pop('error', 'My Itineraries', 'Failed to load Itineraries');
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

    serviceInput = '';
    loading = false;

    constructor(
        public dialogRef: MatDialogRef<CreateItinerary>,
        private itineraryService: ItineraryService,
        private toasterService: ToasterService,
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

    createItinerary () {
        const payload = this.data;
        payload.backdrop = "https://static.businessinsider.sg/2018/03/st-singapore-supertrees-4113.jpg";
        this.loading = true;
        this.itineraryService.createItinerary(payload)
            .subscribe(res => {
                if (res['IsSuccess']) {
                    this.onNoClick();
                    this.toasterService.pop('success', 'Itinerary created', 'You have successfully created an Itinerary');
                    // this.router.navigateByUrl('/');
                }
            });
    }

}

/* --------------------------------------------------------------------------------------------- */
