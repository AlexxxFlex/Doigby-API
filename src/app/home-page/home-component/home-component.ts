import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductApiService } from '../../services/product-api-service';
import { ListProductComponent } from '../list-product-component/list-product-component';
import { InfiniteScrollDirective } from '../../directives/intersection-oberver.directive';
import { HamsterLoaderComponent } from '../../components/hamster-loader-component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ListProductComponent, InfiniteScrollDirective, HamsterLoaderComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductApiService);
  
  allProducts: any[] = []; 
  displayedProducts: any[] = []; 

  itemsPerPage = 9;
  currentIndex = 0;
  isLoading = false;

  showSizeModal = false;
  selectedProduct: any = null;
  selectedSize: string = '';
  selectedColor: string = '';

  ngOnInit(): void {
    this.productService.getAllProductsStock().subscribe((data: any[]) => {
      this.allProducts = data;
      this.displayedProducts = this.allProducts.slice(0, this.itemsPerPage);
      this.currentIndex = this.itemsPerPage;
    });
  }

  loadMoreProducts(): void {
    if (this.isLoading || this.currentIndex >= this.allProducts.length) return;

    this.isLoading = true;

    setTimeout(() => {
      const nextBatch = this.allProducts.slice(
        this.currentIndex, 
        this.currentIndex + this.itemsPerPage
      );
      
      this.displayedProducts = [...this.displayedProducts, ...nextBatch];
      this.currentIndex += this.itemsPerPage;
      this.isLoading = false;
    }, 1500);
  }

  openSizeModal(product: any): void {
    this.productService.getProductWithVariant(product.id).subscribe(fullProduct => {
      this.selectedProduct = fullProduct;
      this.selectedSize = fullProduct.sizes?.[0] || '';
      this.selectedColor = fullProduct.colors?.[0] || '';
      this.showSizeModal = true;
    });
  }

  closeSizeModal(): void {
    this.showSizeModal = false;
    this.selectedProduct = null;
    this.selectedSize = '';
    this.selectedColor = '';
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  addToCart(): void {
    console.log('Ajout au panier:', {
      product: this.selectedProduct,
      size: this.selectedSize,
      color: this.selectedColor,
    });
    this.closeSizeModal();
  }
}