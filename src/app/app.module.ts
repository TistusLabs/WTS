import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// Mat
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
// import {MatButtonModule} from '@angular/material';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthComponent} from './auth/auth.component';
import {TopbarComponent} from './topbar/topbar.component';
import {AgentDashboardComponent} from './agent-dashboard/agent-dashboard.component';
import {TravellerDashboardComponent} from './traveller-dashboard/traveller-dashboard.component';
import {AgentItineraryCreateComponent} from './agent-itinerary-create/agent-itinerary-create.component';
import {AgentItineraryViewComponent} from './agent-itinerary-view/agent-itinerary-view.component';
import {AccountComponent} from './account/account.component';
import {GeneralSearchComponent} from './general-search/general-search.component';
import {BodyComponent} from './body/body.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardImage, MatCardModule, MatFormFieldModule, MatIconModule, MatToolbarModule} from '@angular/material';

@NgModule({
    declarations: [
        AppComponent,
        AuthComponent,
        TopbarComponent,
        AgentDashboardComponent,
        TravellerDashboardComponent,
        AgentItineraryCreateComponent,
        AgentItineraryViewComponent,
        AccountComponent,
        GeneralSearchComponent,
        BodyComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        // Mat
        // NoopAnimationsModule,
        // MatButtonModule,
        MatIconModule,
        // MatToolbarModule,
        // MatCardModule,
        // MatFormFieldModule,
        FlexLayoutModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
