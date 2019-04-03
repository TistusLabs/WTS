import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { AuthComponent } from './auth/auth.component';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './profile/profile.component';
import { AgentItineraryComponent } from './agent-itinerary/agent-itinerary.component';
import { AuthGuard } from './auth.guard';
import { AgentItinerariesComponent } from './agent-itineraries/agent-itineraries.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsofserviceComponent } from './termsofservice/termsofservice.component';

const routes: Routes = [
    {
        path: '',
        component: GeneralComponent,
        pathMatch: 'full'
    }, {
        path: 'search',
        component: GeneralComponent
    }, {
        path: 'auth/signin',
        component: AuthComponent,
        data: {
            signin: true
        }
    }, {
        path: 'auth/signup',
        component: AuthComponent,
        data: {
            signin: false
        }
    }, {
        path: 'account',
        component: AccountComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'profile',
        component: ProfileComponent
    }, {
        path: 'profile/:id',
        component: ProfileComponent
    }, {
        path: 'itineraries',
        component: AgentItinerariesComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'itinerary/:id',
        component: AgentItineraryComponent,
        data: {
            itinerary: null
        }
    }, {
        path: 'privacypolicy',
        component: PrivacypolicyComponent
    }, {
        path: 'termsofservice',
        component: TermsofserviceComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
