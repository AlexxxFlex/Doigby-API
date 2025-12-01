import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductApiService, Product } from '../../services/product-api-service';

@Component({
  selector: 'app-details-product-component',
  imports: [CommonModule],
  templateUrl: './details-product-component.html',
  styleUrl: './details-product-component.css',
})
export class DetailsProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductApiService);

  product: Product | null = null;
  selectedSize: string = '';
  selectedColor: string = '';
  selectedImage: string = '';
  quantity: number = 1;
  isLoading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadProduct(slug);
    }
  }

  private loadProduct(slug: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.productService.getProductWithVariantBySlug(slug).subscribe({
      next: (product) => {
        this.product = product;
        if (this.product) {
          this.selectedImage = this.product.images?.[0] || this.product.image || 'assets/placeholder.jpg';
          this.selectedSize = this.product.sizes?.[0] || '';
          this.selectedColor = this.product.colors?.[0] || '';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du produit:', err);
        this.error = 'Produit non trouvé';
        this.isLoading = false;
      }
    });
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < (this.product.stock || 0)) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  isAvailable(): boolean {
    return this.product?.isActive === true;
  }

  getAverageRating(): number {
    if (!this.product?.reviews || this.product.reviews.length === 0) {
      return 0;
    }
    const sum = this.product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this.product.reviews.length;
  }

  addToCart(): void {
    if (!this.isAvailable()) return;
    
    console.log('Ajout au panier:', {
      product: this.product,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.quantity
    });
  }
}
