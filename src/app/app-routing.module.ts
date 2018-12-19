import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GeneralSearchComponent} from './general-search/general-search.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  }, {
    path: 'search',
    component: GeneralSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
