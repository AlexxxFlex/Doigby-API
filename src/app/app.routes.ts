import { Routes } from '@angular/router';
import { AboutComponent} from '../pages/about-component/about-component';
import { HistoryComponent } from '../pages/history-component/history-component';
import { CroissanceComponent } from '../pages/croissance-component/croissance-component';
import { HomeComponent } from './home-page/home-component/home-component';
import { DetailsProductComponent } from './home-page/details-product-component/details-product-component';

export const routes: Routes = [
  {path: 'about', component: AboutComponent},
  { path: 'croissance', component: CroissanceComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'product/:slug', component: DetailsProductComponent },
  { path: '', component: HomeComponent },
];
