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
    MatDialogModule, MatDialogRef, MatFormFieldModule,
    // MatFormFieldModule,
    MatIconModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule,
    MatTabsModule,
    // MatToolbarModule
} from '@angular/material';
import {EditProfile, ProfileComponent} from './profile/profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgentItineraryComponent} from './agent-itinerary/agent-itinerary.component';
import { AgentItinerariesComponent, CreateItinerary } from './agent-itineraries/agent-itineraries.component';
import {NouisliderModule} from 'ng2-nouislider';

export function tokenGetter() {
    return localStorage.getItem('access_token');
}

@NgModule({
    entryComponents: [
        EditProfile,
        CreateItinerary
    ],
    declarations: [
        AppComponent,
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
        AgentItinerariesComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
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
        NoopAnimationsModule,
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
        // MatChipsModule,
        // MatAutocompleteModule,
        // MatFormFieldModule,
        FlexLayoutModule,
        NouisliderModule
    ],
    providers: [
        AuthGuard,
        AuthService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
