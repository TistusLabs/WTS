import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GeneralComponent} from './general/general.component';
import {AuthComponent} from './auth/auth.component';
import {AccountComponent} from './account/account.component';
import {ProfileComponent} from './profile/profile.component';
import {AgentItineraryComponent} from './agent-itinerary/agent-itinerary.component';
import {AuthGuard} from './auth.guard';
import {AgentItinerariesComponent} from './agent-itineraries/agent-itineraries.component';

const routes: Routes = [
    {
        path: '',
        component: GeneralComponent,
        pathMatch: 'full'
    }, {
        path: 'search',
        component: GeneralComponent
    }, {
        path: 'auth',
        component: AuthComponent
    }, {
        path: 'account',
        component: AccountComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'itineraries',
        component: AgentItinerariesComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'itinerary/:id',
        component: AgentItineraryComponent,
        data: {
          itinerary : null
        },
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
