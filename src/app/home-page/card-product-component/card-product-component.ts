import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-product',
  imports: [CommonModule],
  templateUrl: './card-product-component.html',
  styleUrl: './card-product-component.css',
})
export class CardProductComponent {
  @Input() product: any;
  @Output() addToCart = new EventEmitter<any>();

  constructor(private router: Router) {}

  onCardClick(): void {
    this.router.navigate(['/product', this.product.slug]);
  }

  onAddToCartModal(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  isAvailable(): boolean {
    return this.product.stock > 0;
  }

  getStockBadge(): string {
    if (this.product.stock === 0) return 'Rupture de stock';
    if (this.product.stock < 5) return 'Stock limité';
    return '';
  }
}