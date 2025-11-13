import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductApiService } from '../../services/product-api-service';
import { ListProductComponent } from '../list-product-component/list-product-component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ListProductComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductApiService);
  groupedProducts: { [key: string]: any[] } = {};

  selectedProduct: any = null;
  showSizeModal = false;
  sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: any[]) => {
      this.groupProductsByCategory(data);
    });
  }

  private groupProductsByCategory(products: any[]): void {
    this.groupedProducts = products.reduce((acc, product) => {
      const categoryId = product.category.id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(product);
      return acc;
    }, {});
  }

  getCategories(): string[] {
    return Object.keys(this.groupedProducts);
  }

  getCategoryName(categoryId: string): string {
    const product = this.groupedProducts[categoryId]?.[0];
    return product?.category?.name || '';
  }

  openSizeModal(product: any): void {
    this.selectedProduct = product;
    this.showSizeModal = true;
  }

  closeSizeModal(): void {
    this.showSizeModal = false;
    this.selectedProduct = null;
  }

  addToCart(product: any, size: string): void {
    console.log('Ajout au panier:', { product, size });
    // Logique d'ajout au panier à implémenter
    this.closeSizeModal();
  }
}