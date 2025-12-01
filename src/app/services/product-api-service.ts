import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map, mergeMap} from 'rxjs';
import { environment } from '../environments/environment';

export interface ApiProduct {
  data: {
    id: number;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    isActive: boolean;
    createdAt: string;
    categoryId: number;
  };
  _links: {
    self: string;
    category: string;
    variants: string;
    images: string;
    reviews: string;
  };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
  categoryId: number;
  image?: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  stock?: number;
  category?: { name: string };
}

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Products`;

  getProducts(): Observable<Product[]> {
    return this.http.get<ApiProduct[]>(this.apiUrl).pipe(
      map(response => response.map(item => this.mapToProduct(item)))
    );
  }

  private mapToProduct(apiProduct: ApiProduct): Product {
    return {
      ...apiProduct.data,
      // Default values for missing fields
      image: 'assets/placeholder.jpg',
      images: [],
      sizes: [],
      colors: [],
      stock: 10, // Default stock
      category: { name: 'Catégorie' }
    };
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.slug === slug))
    );
  }

  getProductVariant(productId: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${productId}/variants`).pipe(
      map(variants => variants[0])
    );
  }

  getProductWithVariant(productId: number): Observable<Product> {
    return this.http.get<ApiProduct>(`${this.apiUrl}/${productId}`).pipe(
      map(response => this.mapToProduct(response))
    );
  }

  getProductWithVariantBySlug(slug: string): Observable<Product> {
    return this.getProductBySlug(slug).pipe(
      mergeMap(product => {
        if (!product) throw new Error('Product not found');
        return this.http.get<ApiProduct>(`${this.apiUrl}/${product.id}`).pipe(
          map(response => this.mapToProduct(response))
        );
      })
    );
  }

  getAllProductsStock(): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(p => p.isActive))
    );
  }
}
