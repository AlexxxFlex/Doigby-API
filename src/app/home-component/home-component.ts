import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-component',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  constructor(private router: Router) {}

  histoire(event: Event) {
    console.log("clic bouton", event);
    event.preventDefault();
    this.router.navigate(['/histoire']);
  }

  croissance(event : Event) {
    console.log("clic bouton", event);
    event.preventDefault();
    this.router.navigate(['/croissance']);
  }

  api(event : Event) {
    console.log("clic bouton", event);
    event.preventDefault();
    this.router.navigate(['/']);
  }
}
