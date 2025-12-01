import { Component } from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone : true,
  selector: 'app-header',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}
  home(event: Event) {
    console.log("clic bouton", event);
    event.preventDefault();
    this.router.navigate(['/']);
    this.isMenuOpen = false;
  }

  toggleMenu(event: Event) {
    event.preventDefault();
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateTo(event: Event, route: string) {
    console.log("navigation vers", route);
    event.preventDefault();
    this.router.navigate([route]);
    this.isMenuOpen = false;
  }
}
