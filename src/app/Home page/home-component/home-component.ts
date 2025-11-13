import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductApiService} from '../services/product-api-service';


@Component({
  selector: 'app-api-component',
  imports: [CommonModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {

  private productService= inject(ProductApiService);
  products: any[] = [];
  groupedProducts: { [key: string]: any[] } = {};

  selectedProduct: any = null;
  showSizeModal = false;
  sizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];


  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: any[]) => {
      console.log(data);
      this.products = data;
      this.groupProductsByCategory();
    });
  }

  groupProductsByCategory() {
    this.groupedProducts = this.products.reduce((acc, product) => {
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

  openSizeModal(product: any) {
    this.selectedProduct = product;
    this.showSizeModal = true;
  }

  closeSizeModal() {
    this.showSizeModal = false;
    this.selectedProduct = null;
  }

}
