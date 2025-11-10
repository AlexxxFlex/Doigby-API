import { Routes } from '@angular/router';
import { HomeComponent} from './home-component/home-component';
import {HistoireComponent} from './histoire-component/histoire-component'
import {CroissanceComponent} from './croissance-component/croissance-component'

export const routes: Routes = [
  { path: 'croissance', component: CroissanceComponent },
  { path: 'histoire', component: HistoireComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },

];
