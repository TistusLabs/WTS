import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Mat
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { TopbarComponent } from './topbar/topbar.component';
import { AgentDashboardComponent } from './agent-dashboard/agent-dashboard.component';
import { TravellerDashboardComponent } from './traveller-dashboard/traveller-dashboard.component';
import { AgentItineraryCreateComponent } from './agent-itinerary-create/agent-itinerary-create.component';
import { AgentItineraryViewComponent } from './agent-itinerary-view/agent-itinerary-view.component';
import { AccountComponent } from './account/account.component';
import { GeneralSearchComponent } from './general-search/general-search.component';

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
    GeneralSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // Mat
    NoopAnimationsModule, MatButtonModule, MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
