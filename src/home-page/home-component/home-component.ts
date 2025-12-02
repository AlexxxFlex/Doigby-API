import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  private router = inject(Router);
  
  allProducts: any[] = []; 
  displayedProducts: any[] = []; 

  itemsPerPage = 9;
  currentIndex = 0;
  isLoading = false;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProductsStock().subscribe((data: any[]) => {
      this.allProducts = data;
      this.displayedProducts = this.allProducts.slice(0, this.itemsPerPage);
      this.currentIndex = this.itemsPerPage;
    });
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
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
}