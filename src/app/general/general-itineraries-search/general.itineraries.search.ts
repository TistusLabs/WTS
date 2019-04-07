import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ItineraryService} from '../../services/itinerary.service';
import {UserService} from '../../services/user.service';
import * as $ from 'jquery';
import {ActivatedRoute} from '@angular/router';

@Component({
    templateUrl : './general.itineraries.search.html',
    styleUrls : ['./general.itineraries.search.scss']
})
export class GeneralItineriesSearch implements OnInit, OnDestroy{
    @Input() public startDate;
    @Input() public noOfTravellers;

    loading = false;
    profiles = [];
    itineraries = [];
    fh = 0;
    searchAttr = {
        start : new Date(),
        end : new Date(),
        location : '',
        price : 0,
        type : '',
        people : 0
    };
    public self = this;
    constructor(
        public itineraryService: ItineraryService,
        public userService: UserService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.getAllItineraries();
        this.adjustInitHeight();
        this.searchAttr.start = new Date(this.route.snapshot.paramMap.get('start'));
        this.searchAttr.people = this.route.snapshot.paramMap.get('people');
        // window.addEventListener('scroll', this.adjustFilters, true);
    }
    // ngOnDestroy() {
    //     window.removeEventListener('scroll', this.adjustFilters, true);
    // }
    adjustInitHeight () {
        const height = window.innerHeight;
        $('.wts-general-search').css({'min-height': (height - 50) + 'px'});
        $('.wts-search-advanced').css({'height': (height - 140) + 'px'});
    }
    adjustFilters() {
        const fh = $('.wts-search-advanced').height();
        const sp = $(document).scrollTop();
        const sh = $(document).innerHeight();
        if (sp <= 50) {
            $('.wts-search-advanced').css('height', fh + sp);
        }
    }
    getAllItineraries() {
        this.loading = true;
        this.itineraryService.getAllItineraries()
            .subscribe(res => {
                // get profiles before setting data to the object
                const temp_itineraries = res['Data'];
                const userIdList = [];
                for (const i_ of res['Data']) {
                    if (userIdList.includes(i_.userId) === false) {
                        userIdList.push(i_.userId);
                    }
                }
                this.setProfilesForItineries(userIdList, temp_itineraries);
            });
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
    getProfileForID(userId) {
        const returnObj = {
            name: 'Austin',
            picture: './assets/user_male.jpg',
            stars: Array(4).fill(0).map((x, i) => i),
            rating: 5.0,
            languages: ['English', 'Mandarin']
        };
        for (const profile of this.profiles) {
            if (profile.userId === userId) {
                returnObj.name = profile.fname;
                returnObj.picture = profile.image_url;
                break;
            }
        }
        return returnObj;
    }
}
