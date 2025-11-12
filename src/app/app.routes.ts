import { Routes } from '@angular/router';
import { HomeComponent} from './home-component/home-component';
import {HistoireComponent} from './histoire-component/histoire-component'
import {CroissanceComponent} from './croissance-component/croissance-component'
import {ApiComponent} from './api-component/api-component'

export const routes: Routes = [
  {path: 'home', component: HomeComponent},
  { path: 'croissance', component: CroissanceComponent },
  { path: 'histoire', component: HistoireComponent },
  { path: 'api', component: ApiComponent },
  { path: '', component: ApiComponent },

];
