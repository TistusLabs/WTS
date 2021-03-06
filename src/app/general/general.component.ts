import { Component, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import * as $ from 'jquery';
// import * as slick from 'slick';
import { AuthService } from '../services/auth.service';
import { ItineraryService } from '../services/itinerary.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Profile_ } from '../data/user.model';
import { MessageService } from '../services/message.service';

@Component({
    selector: 'app-general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit, OnDestroy {

    minDate = new Date();
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
    profiles = [];
    el = null;
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
        place: 'Singapore',
        places: ['Singapore', 'Malaysia'],
        start: new Date(),
        end: new Date(),
        people: 1,
        pricerange: [0, 150]
    };
    itineraries = [];
    // itineraries = [{
    //     id : 'itinerary#1',
    //     backdrop : './assets/event/singapore.jpg.jpg',
    //     title : 'Historical Night Tour',
    //     description : 'Come with me on a night tour and I will immerse you in the history and current affairs of Singapore! I am a qualified Singapore tour guide with a special interest in culture',
    //     activities: 'Join me on a journey through Singapore from past to present. Explore the historic Civic District before',
    //     conditions: 'Guests aged 6 and up can attend',
    //     price : 129,
    //     services: [
    //         'Meal', 'Drinks', 'Ticket'
    //     ],
    //     area: 'Singapore',
    //     from: '4th January 2019',
    //     to: '10th January 2019',
    //     notes: 'You must be able to walk 6km to join this tour',
    //     guide : {
    //         name : 'Amelia',
    //         picture : './assets/user_female.jpg',
    //         stars : Array(3).fill(0).map((x, i) => i),
    //         rating : 5.0,
    //         languages: ['English', 'Mandarin']
    //     }
    // }, {
    //     id : 'itinerary#2',
    //     backdrop : './assets/event/hokkien-mee-.jpg',
    //     title : 'Singapore Shopping Trip',
    //     description : 'Come with me on a night tour and I will immerse you in the history and current affairs of Singapore! I am a qualified Singapore tour guide with a special interest in culture',
    //     activities: 'Join me on a journey through Singapore from past to present. Explore the historic Civic District before',
    //     conditions: 'Guests aged 6 and up can attend',
    //     price : 59,
    //     services: [
    //         'Meal', 'Drinks', 'Ticket'
    //     ],
    //     area: 'Singapore',
    //     from: '4th January 2019',
    //     to: '10th January 2019',
    //     notes: 'You must be able to walk 6km to join this tour',
    //     guide : {
    //         name : 'Austin',
    //         picture : './assets/user_male.jpg',
    //         stars : Array(4).fill(0).map((x, i) => i),
    //         rating : 5.0,
    //         languages: ['English', 'Mandarin']
    //     }
    // }];

    topGuides = [];

    /*{
        fname: 'Shehan',
        tagline: 'Live life to the fullest',
        type: 'traveller',
        interests: ['Hiking', 'Cooking'],
        lifestyle: ['Simple'],
        address: 'No 20, Hill Street, Singapore',
        lname: 'Peters',
        image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXo_o26uqbNH68_AVxVT02uWqiKw5CGyClFpAaoWIAVr7G_uvbrg',
        name : 'Shehan',
        picture : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXo_o26uqbNH68_AVxVT02uWqiKw5CGyClFpAaoWIAVr7G_uvbrg',
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
    }*/

    topLocations = [{
        name: 'Kampong Glam',
        picture: './assets/locations/kampong_glam.jpg'
    }, {
        name: 'NUS University',
        picture: './assets/locations/nus_university.jpg'
    }, {
        name: 'Haji Lane',
        picture: './assets/locations/haji_lane.jpg'
    }, {
        name: 'Kampong Glam',
        picture: './assets/locations/kampong_glam.jpg'
    }, {
        name: 'NUS University',
        picture: './assets/locations/nus_university.jpg'
    }, {
        name: 'Haji Lane',
        picture: './assets/locations/haji_lane.jpg'
    }];
    eh = null;
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router,
        private itineraryService: ItineraryService,
        private msgService: MessageService
    ) {
    }
    loading = false;
    itemFlexSetter = 32;

    ngOnInit() {
        this.getAllItineraries();
        // this.getTopGuides();

        // authenticated requests
        const user = this.authService.getAuthenticatedUser();
        if (user) {
            // debugger
        }

        this.tryGetProfile();
        this.adjustBannerHeight(0);
        window.addEventListener('scroll', this.initAdjustments, true);
    }
    ngOnDestroy() {
        window.removeEventListener('scroll', this.initAdjustments, true);
    }

    // initBanner() {
    //     $('.fade').slick({
    //         dots: true,
    //         infinite: true,
    //         speed: 500,
    //         fade: true,
    //         cssEase: 'linear'
    //     });
    // }
    initAdjustments() {
        const sp = $(document).scrollTop();
        if (sp >= 200) {
            $('.wts-search-dates').addClass('wts-search-float');
        } else {
            $('.wts-search-dates').removeClass('wts-search-float');
        }
    }
    adjustBannerHeight (sh) {
        const height = window.innerHeight;
        document.getElementById('general-comp-banner').setAttribute('style', 'height:' + height + 'px');
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
                    this.msgService.broadcast('profileObj', this.user);
                    this.userService.setCurrentUserProfile(this.user);
                }
            });
    }

    searchNow() {
        this.router.navigate(['/search/advanced', {
            start : this.searchAttr.start,
            people : this.searchAttr.people
        }]);
    }

    getAllItineraries() {
        //debugger
        this.loading = true;
        this.itineraryService.getAllItineraries()
            .subscribe(res => {
                // get profiles before setting data to the object
                let temp_itineraries = res['Data'];
                let userIdList = [];
                for (const i_ of res['Data']) {
                    if (userIdList.includes(i_.userId) == false) {
                        userIdList.push(i_.userId);
                    }
                }
                this.setProfilesForItineries(userIdList, temp_itineraries);
            });
    }

    getProfileForID(userId) {
        let returnObj = {
            userId : '',
            name: 'Austin',
            picture: './assets/user_male.jpg',
            stars: Array(4).fill(0).map((x, i) => i),
            rating: 5.0,
            languages: ['English', 'Mandarin']
        };
        for (const profile of this.profiles) {
            if (profile.userId == userId) {
                returnObj.userId = userId;
                returnObj.name = profile.fname;
                returnObj.picture = profile.image_url;
                break;
            }
        }
        return returnObj;
    }

    setProfilesForItineries(list, itineraries) {
        this.userService.getProfilesBulk(list)
            .subscribe(res => {
                //debugger
                this.profiles = res['Data'];
                for (const itin of itineraries) {
                    itin.guide = this.getProfileForID(itin.userId);
                }
                this.itineraries = itineraries;
                this.loading = false;
            });
    }

    getTopGuides() {
        this.loading = true;
        this.userService.getTopGuides()
            .subscribe(res => {
                this.topGuides = res['Data'];
                // for (const i_ of this.itineraries) {
                //     i_.guide = {
                //         name : 'Austin',
                //         picture : './assets/user_male.jpg',
                //         stars : Array(4).fill(0).map((x, i) => i),
                //         rating : 5.0,
                //         languages: ['English', 'Mandarin']
                //     };
                // }
                this.loading = false;
            });
    }

    openItinerary(itinerary) {
        this.itineraryService.setItinerary(itinerary);
        this.router.navigateByUrl('/itinerary/' + itinerary.itinerary_id);
    }

    updateSearchArea(area) {
        this.searchAttr.place = area;
    }

    goToProfile(user) {
        debugger
        //this.userService.setHomeUser(user);
        this.router.navigateByUrl('/profile/' + user.userId);
    }

}
