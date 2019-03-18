import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// Mat
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
// import {MatButtonModule} from '@angular/material';

// Auth
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './auth.guard';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthComponent} from './auth/auth.component';
import {TopbarComponent} from './topbar/topbar.component';
import {AgentDashboardComponent} from './agent-dashboard/agent-dashboard.component';
import {TravellerDashboardComponent} from './traveller-dashboard/traveller-dashboard.component';
import {AccountComponent} from './account/account.component';
import {GeneralComponent} from './general/general.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
    MAT_DIALOG_DATA,
    MatDatepickerModule, MatDatepickerToggle,
    // MatAutocompleteModule,
    // MatCardImage,
    // MatCardModule,
    // MatChipsModule,
    MatDialogModule, MatDialogRef, MatDividerModule, MatFormFieldModule,
    // MatFormFieldModule,
    MatIconModule, MatMenuModule, MatNativeDateModule, MatOptionModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    // MatToolbarModule
} from '@angular/material';
import {EditProfile, ProfileComponent} from './profile/profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgentItineraryComponent} from './agent-itinerary/agent-itinerary.component';
import { AgentItinerariesComponent, CreateItinerary } from './agent-itineraries/agent-itineraries.component';
import {NouisliderModule} from 'ng2-nouislider';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import {UserService} from './services/user.service';
import {MessageService} from './services/message.service';
import {HttpClient, HttpClientModule, HttpHandler} from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import {EventBlockComponent} from './_WIDGETS/wts-event-block/wts_event_block.widget';
import {ImageGridComponent} from './_WIDGETS/wts-image-grid/wts_image_grid.widget';
import {ItineraryComponent} from './_WIDGETS/wts-itinerary-block/wts_itinerary_block.widget';
import {BannerCommonComponent} from './_WIDGETS/wts-banner-common/wts_banner_common.widget';
import {RatingMainComponent} from './_WIDGETS/wts-rating-main/wts_rating_main.widget';
import {RatingOverallComponent} from './_WIDGETS/wts-rating-overall/wts_rating_overall.widget';
import { ItineraryBook } from './agent-itinerary/itinerary-book/itinerary-book.component';
import { BodyComponent } from './body/body.component';

export function tokenGetter() {
    return localStorage.getItem('access_token');
}

@NgModule({
    entryComponents: [
        EditProfile,
        CreateItinerary,
        ItineraryBook
    ],
    declarations: [
        AppComponent,
        BodyComponent,
        AuthComponent,
        TopbarComponent,
        AgentDashboardComponent,
        TravellerDashboardComponent,
        AccountComponent,
        GeneralComponent,
        ProfileComponent,
        EditProfile,
        AgentItineraryComponent,
        CreateItinerary,
        AgentItinerariesComponent,
        FooterComponent,
        EventBlockComponent,
        ImageGridComponent,
        ItineraryComponent,
        BannerCommonComponent,
        RatingMainComponent,
        RatingOverallComponent,
        ItineraryBook
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: ['localhost:4200'],
                blacklistedRoutes: [
                    'localhost:4200/account',
                    'localhost:4200/profile',
                    'localhost:4200/itineraries'
                ]
            }
        }),
        // Mat
        // NoopAnimationsModule,
        // MatButtonModule,
        MatIconModule,
        // MatToolbarModule,
        // MatCardModule,
        // MatFormFieldModule,
        MatTabsModule,
        MatDialogModule,
        MatDatepickerModule,
        MatPaginatorModule,
        MatNativeDateModule,
        MatMenuModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSnackBarModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        // MatChipsModule,
        // MatAutocompleteModule,
        // MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        FlexLayoutModule,
        NouisliderModule,
        ToasterModule
    ],
    providers: [
        AuthGuard,
        AuthService,
        ToasterService,
        UserService,
        MessageService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
