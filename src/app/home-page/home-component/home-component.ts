import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductApiService } from '../../services/product-api-service';
import { ListProductComponent } from '../list-product-component/list-product-component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ListProductComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private productService = inject(ProductApiService);
  private elementRef = inject(ElementRef);
  
  allProducts: any[] = []; 
  displayedProducts: any[] = []; 

  itemsPerPage = 9;
  currentIndex = 0;
  isLoading = false;

  private observer: IntersectionObserver | null = null;

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

  ngAfterViewInit() {
    // Configuration de l'Intersection Observer
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadMoreProducts();
        }
      });
    }, options);

    // On cible l'élément via sa classe CSS
    const target = this.elementRef.nativeElement.querySelector('.loading-trigger');
    if (target) {
      this.observer.observe(target);
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
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