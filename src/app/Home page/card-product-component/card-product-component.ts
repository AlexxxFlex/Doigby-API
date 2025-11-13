import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-product',
  imports: [],
  templateUrl: './card-product-component.html',
  styleUrl: './card-product-component.css',
})
export class CardProductComponent {
  @Input() product: any;
  @Output() addToCart = new EventEmitter<any>();

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  // Méthode pour formater le prix
  getFormattedPrice(): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(this.product.price);
  }

  // Méthode pour vérifier la disponibilité
  isAvailable(): boolean {
    return this.product.stock > 0;
  }

  // Méthode pour obtenir le badge de stock
  getStockBadge(): string {
    if (this.product.stock === 0) return 'Rupture de stock';
    if (this.product.stock < 5) return 'Stock limité';
    return '';
  }
}