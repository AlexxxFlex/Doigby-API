import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductApiService } from '../../services/product-api-service';

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

  product: any = null;
  selectedSize: string = '';
  selectedColor: string = '';
  selectedImage: string = '';
  quantity: number = 1;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadProduct(slug);
    }
  }

  private loadProduct(slug: string): void {
    this.productService.getProductWithVariantBySlug(slug).subscribe(product => {
      this.product = product;
      if (this.product) {
        this.selectedImage = this.product.images?.[0] || this.product.image;
        this.selectedSize = this.product.sizes?.[0] || '';
        this.selectedColor = this.product.colors?.[0] || '';
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
    if (this.quantity < this.product.stock) {
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
    return this.product?.stock > 0;
  }

  addToCart(): void {
    console.log('Ajout au panier:', {
      product: this.product,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.quantity
    });
  }
}
