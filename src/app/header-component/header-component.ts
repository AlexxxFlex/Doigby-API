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
  constructor(private router: Router) {}

  home(event: Event) {
    console.log("clic bouton", event);
    event.preventDefault();
    this.router.navigate(['/home']);
  }

  navigateTo(event: Event, route: string) {
    console.log("navigation vers", route);
    event.preventDefault();
    this.router.navigate([route]);
  }
}
