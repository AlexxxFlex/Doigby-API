import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-histoire-component',
  imports: [],
  templateUrl: './histoire-component.html',
  styleUrl: './histoire-component.css',
})
export class HistoireComponent {
  constructor(private router: Router) {}

  home(event: Event) {
    console.log("clic bouton", event);
    event.preventDefault();
    this.router.navigate(['/']);
  }
}
