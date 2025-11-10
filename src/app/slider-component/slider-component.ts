import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  image: string;
  title: string;
  description: string;
}

@Component({
  selector: 'image-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slider-component.html',
  styleUrl: './slider-component.css'
})
export class ImageSliderComponent {
  @Input() slides: Slide[] = [];
  currentSlide = 0;

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}