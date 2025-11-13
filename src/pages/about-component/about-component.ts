import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-component',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './about-component.html',
  styleUrl: './about-component.css',
})
export class AboutComponent {
  constructor(private router: Router) {}

  history(event: Event) {
    console.log("clic bouton", event);
    event.preventDefault();
    this.router.navigate(['/history']);
  }

  croissance(event : Event) {
    console.log("clic bouton", event);
    event.preventDefault();
    this.router.navigate(['/croissance']);
  }

  home(event : Event) {
    console.log("clic bouton", event);
    event.preventDefault();
    this.router.navigate(['/']);
  }
}
