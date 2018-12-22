import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GeneralSearchComponent} from './general-search/general-search.component';
import {AuthComponent} from './auth/auth.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  }, {
    path: 'search',
    component: GeneralSearchComponent
  }, {
    path: 'auth',
    component: AuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
