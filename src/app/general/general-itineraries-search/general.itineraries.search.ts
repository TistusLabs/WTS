import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ItineraryService} from '../../services/itinerary.service';
import {UserService} from '../../services/user.service';
import * as $ from 'jquery';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import {map, startWith} from 'rxjs/internal/operators';

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
        price : [0, 10000],
        type : '',
        people : '1'
    };
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl();
    filteredFruits: Observable<string[]>;
    fruits: string[] = ['Leisure'];
    allFruits: string[] = ['Hiking', 'Music', 'History', 'Party', 'Leisure'];

    @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    constructor(
        public itineraryService: ItineraryService,
        public userService: UserService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
            startWith(null),
            map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
    }

    add(event: MatChipInputEvent): void {
        // Add fruit only when MatAutocomplete is not open
        // To make sure this does not conflict with OptionSelected Event
        if (!this.matAutocomplete.isOpen) {
            const input = event.input;
            const value = event.value;

            // Add our fruit
            if ((value || '').trim()) {
                this.fruits.push(value.trim());
            }

            // Reset the input value
            if (input) {
                input.value = '';
            }

            this.fruitCtrl.setValue(null);
        }
    }

    remove(fruit: string): void {
        const index = this.fruits.indexOf(fruit);

        if (index >= 0) {
            this.fruits.splice(index, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.fruits.push(event.option.viewValue);
        this.fruitInput.nativeElement.value = '';
        this.fruitCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
    }

    ngOnInit() {
        this.getAllItineraries();
        this.adjustInitHeight();
        this.searchAttr.start = new Date(this.route.snapshot.paramMap.get('start'));
        this.searchAttr.people = this.route.snapshot.paramMap.get('people');
        // window.addEventListener('scroll', this.adjustFilters, true);
    }
    ngOnDestroy() {
        // window.removeEventListener('scroll', this.adjustFilters, true);
    }
    adjustInitHeight () {
        const height = window.innerHeight;
        $('.wts-general-search').css({'min-height': (height - 50) + 'px'});
        $('.wts-search-advanced').css({'height': (height - 85) + 'px'});
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
    openItinerary(itinerary) {
        this.itineraryService.setItinerary(itinerary);
        this.router.navigateByUrl('/itinerary/' + itinerary.itinerary_id);
    }
}
