import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-history-component',
  imports: [],
  templateUrl: './history-component.html',
  styleUrls: ['./history-component.css'],
})
export class HistoryComponent {
  constructor(private router: Router) {}

  home(event: Event) {
    console.log("clic bouton", event);
    event.preventDefault();
    this.router.navigate(['/']);
  }
}
