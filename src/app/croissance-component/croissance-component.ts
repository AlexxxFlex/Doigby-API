import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ImageSliderComponent } from '../slider-component/slider-component';

@Component({
  selector: 'app-croissance-component',
  standalone: true,
  imports: [ImageSliderComponent],
  templateUrl: './croissance-component.html',
  styleUrls: ['./croissance-component.css'],
})
export class CroissanceComponent {
  constructor(private router: Router) {}

  slides = [
    {
      image: 'assets/slider-1.jpg',
      title: '2020 - Lancement Initial',
      description: 'Début de notre aventure avec une vision claire et ambitieuse'
    },
    {
      image: 'assets/slider-2.jpg',
      title: '2021 - Expansion Rapide',
      description: 'Croissance exponentielle de notre base utilisateurs'
    },
    {
      image: 'assets/slider-3.jpg',
      title: '2022 - Innovation Technologique',
      description: 'Intégration de technologies de pointe'
    },
    {
      image: 'assets/slider-4.jpg',
      title: '2023 - Reconnaissance Mondiale',
      description: 'Présence établie dans plus de 50 pays'
    },
    {
      image: 'assets/slider-5.jpg',
      title: '2024 - Intelligence Artificielle',
      description: 'Déploiement de solutions AI avancées'
    },
    {
      image: 'assets/slider-6.jpg',
      title: '2025 - Excellence Logistique',
      description: 'Optimisation de notre chaîne d\'approvisionnement'
    },
    {
      image: 'assets/slider-7.jpg',
      title: '2026 - Engagement Durable',
      description: 'Initiatives écologiques et responsables'
    },
    {
      image: 'assets/slider-8.jpg',
      title: '2027 - Équipe Mondiale',
      description: 'Plus de 1000 collaborateurs potentiels à travers le monde'
    }
  ];

  home(event: Event) {
    console.log("clic bouton", event);
    event.preventDefault();
    this.router.navigate(['/home']);
  }
}