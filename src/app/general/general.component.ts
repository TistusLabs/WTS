import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {AuthService} from '../services/auth.service';
import {ItineraryService} from '../services/itinerary.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-general',
    templateUrl: './general_2.component.html',
    styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
    pictures = [{
        'title': 'picture',
        'img': 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/8V46UZCS0V.jpg'
    }, {
        'title': 'picture',
        'img': 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/LTLE4QGRVQ.jpg'
    }, {
        'title': 'picture',
        'img': 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/R926LU1YEA.jpg'
    }, {
        'title': 'picture',
        'img': 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/U9PP3KXXY2.jpg'
    }];
    searchAttr = {
        place : 'Singapore',
        places : ['Singapore', 'Malaysia'],
        start : new Date(),
        end : new Date(),
        pricerange : [0, 150]
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

    topGuides = [{
        fname: 'Amelia',
        tagline: 'Live life to the fullest',
        type: 'traveller',
        interests: ['Hiking', 'Cooking'],
        lifestyle: ['Simple'],
        address: 'No 20, Hill Street, Singapore',
        lname: 'Peters',
        image_url: './assets/guides/user_amelia.jpg',
        name : 'Amelia',
        picture : './assets/guides/user_amelia.jpg',
        stars : Array(4).fill(0).map((x, i) => i),
        rating : 5.0,
        languages: ['English', 'Mandarin']
    }, {
        name : 'Olivia',
        picture : './assets/guides/user_olivia.png',
        stars : Array(4).fill(0).map((x, i) => i),
        rating : 5.0,
        languages: ['English', 'Mandarin']
    }, {
        name : 'Louis',
        picture : './assets/guides/user_louis.jpg',
        stars : Array(4).fill(0).map((x, i) => i),
        rating : 5.0,
        languages: ['English', 'Mandarin']
    }, {
        name : 'Rhys',
        picture : './assets/guides/user_rhys.jpg',
        stars : Array(4).fill(0).map((x, i) => i),
        rating : 5.0,
        languages: ['English', 'Mandarin']
    }];

    topLocations = [{
        name : 'Kampong Glam',
        picture : './assets/locations/kampong_glam.jpg'
    }, {
        name : 'NUS University',
        picture : './assets/locations/nus_university.jpg'
    }, {
        name : 'Haji Lane',
        picture : './assets/locations/haji_lane.jpg'
    }, {
        name : 'Kampong Glam',
        picture : './assets/locations/kampong_glam.jpg'
    }, {
        name : 'NUS University',
        picture : './assets/locations/nus_university.jpg'
    }, {
        name : 'Haji Lane',
        picture : './assets/locations/haji_lane.jpg'
    }];

    constructor(
        private authService: AuthService,
        private router: Router,
        private itineraryService: ItineraryService
    ) {
    }
    loading = false;

    ngOnInit() {
        const user = this.authService.getAuthenticatedUser();
        if (user) {
            this.getAllItineraries();
        } else {
            this.itineraries = [];
        }
    }

    getAllItineraries () {
        this.loading = true;
        this.itineraryService.getAllItineraries()
            .subscribe(res => {
                this.itineraries = res['Data'];
                for (const i_ of this.itineraries) {
                    i_.guide = {
                        name : 'Austin',
                        picture : './assets/user_male.jpg',
                        stars : Array(4).fill(0).map((x, i) => i),
                        rating : 5.0,
                        languages: ['English', 'Mandarin']
                    };
                }
                this.loading = false;
            });
    }

    openItinerary(itinerary) {
        this.itineraryService.setItinerary(itinerary);
        this.router.navigateByUrl('/itinerary/' + itinerary.id);
    }

    updateSearchArea(area) {
        this.searchAttr.place = area;
    }

    goToProfile(user) {
        debugger
        if (user.fname === 'Amelia') {
            this.router.navigate(['/profile', {
                user: user
            }]);
        }
    }

}
