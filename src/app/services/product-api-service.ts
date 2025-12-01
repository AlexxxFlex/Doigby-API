import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map, mergeMap, forkJoin, of} from 'rxjs';
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

export interface ApiProductImage {
  data: {
    id: number;
    productId: number;
    imageUrl: string;
    altText: string;
    displayOrder: number;
    isPrimary: boolean;
  };
}

export interface ApiProductVariant {
  data: {
    id: number;
    productId: number;
    size: string;
    color: string;
    priceAdjustment: number;
    stockQuantity: number;
    sku: string;
  };
}

export interface ApiReview {
  data: {
    id: number;
    productId: number;
    rating: number;
    comment: string;
    createdAt: string;
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
  reviews?: ApiReview['data'][];
}

export interface ApiCategory {
  data: {
    id: number;
    name: string;
    slug: string;
    description: string;
  };
  _links: {
    self: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Products`;
  private categoriesUrl = `${environment.apiUrl}/categories`;
  private categoriesCache: Map<number, ApiCategory['data']> = new Map();

  getCategories(): Observable<ApiCategory[]> {
    return this.http.get<ApiCategory[]>(this.categoriesUrl);
  }

  private getCategoryById(categoryId: number): Observable<ApiCategory['data']> {
    if (this.categoriesCache.has(categoryId)) {
      return of(this.categoriesCache.get(categoryId)!);
    }
    return this.http.get<ApiCategory>(`${this.categoriesUrl}/${categoryId}`).pipe(
      map(response => {
        this.categoriesCache.set(categoryId, response.data);
        return response.data;
      })
    );
  }

  getProducts(): Observable<Product[]> {
    return forkJoin({
      products: this.http.get<ApiProduct[]>(this.apiUrl),
      categories: this.getCategories()
    }).pipe(
      mergeMap(({ products, categories }) => {
        const categoryMap = new Map(categories.map(c => [c.data.id, c.data]));
        
        // Récupérer les images pour chaque produit
        const productObservables = products.map(item => 
          this.getProductImages(item.data.id).pipe(
            map(images => ({
              ...item.data,
              image: images[0] || '',
              images: images,
              sizes: [],
              colors: [],
              stock: item.data.isActive ? 10 : 0,
              category: { name: categoryMap.get(item.data.categoryId)?.name || 'Catégorie inconnue' }
            }))
          ));
        
        return forkJoin(productObservables);
      })
    );
  }

  private mapToProduct(apiProduct: ApiProduct, category?: ApiCategory['data']): Product {
    return {
      ...apiProduct.data,
      image: 'assets/placeholder.jpg',
      images: [],
      sizes: [],
      colors: [],
      stock: apiProduct.data.isActive ? 10 : 0,
      category: { name: category?.name || 'Catégorie inconnue' }
    };
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.slug === slug))
    );
  }

  getProductImages(productId: number): Observable<string[]> {
    return this.http.get<ApiProductImage[]>(`${environment.apiUrl}/productimages?productId=${productId}`).pipe(
      map(images => {
        if (!images || images.length === 0) {
          return [];
        }
        const sortedImages = images.sort((a, b) => {
          if (a.data.isPrimary) return -1;
          if (b.data.isPrimary) return 1;
          return a.data.displayOrder - b.data.displayOrder;
        });
        return sortedImages.map(img => img.data.imageUrl);
      })
    );
  }

  getProductVariants(productId: number): Observable<ApiProductVariant[]> {
    return this.http.get<ApiProductVariant[]>(`${environment.apiUrl}/productvariants?productId=${productId}`);
  }

  getProductReviews(productId: number): Observable<ApiReview[]> {
    return this.http.get<ApiReview[]>(`${environment.apiUrl}/reviews?productId=${productId}`);
  }

  getProductWithVariant(productId: number): Observable<Product> {
    return this.http.get<ApiProduct>(`${this.apiUrl}/${productId}`).pipe(
      mergeMap(response => 
        forkJoin({
          category: this.getCategoryById(response.data.categoryId),
          images: this.getProductImages(productId),
          variants: this.getProductVariants(productId),
          reviews: this.getProductReviews(productId)
        }).pipe(
          map(({ category, images, variants, reviews }) => {
            const sizes = [...new Set(variants.map(v => v.data.size).filter(s => s))];
            const colors = [...new Set(variants.map(v => v.data.color).filter(c => c))];
            const totalStock = variants.reduce((sum, v) => sum + v.data.stockQuantity, 0);
            
            return {
              ...response.data,
              image: images[0] || 'assets/placeholder.jpg',
              images: images,
              sizes: sizes,
              colors: colors,
              stock: response.data.isActive ? (totalStock > 0 ? totalStock : 10) : 0,
              category: { name: category?.name || 'Catégorie inconnue' },
              reviews: reviews.map(r => r.data)
            };
          })
        )
      )
    );
  }

  getProductWithVariantBySlug(slug: string): Observable<Product> {
    return this.getProductBySlug(slug).pipe(
      mergeMap(product => {
        if (!product) throw new Error('Product not found');
        return this.getProductWithVariant(product.id);
      })
    );
  }

  getAllProductsStock(): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(p => p.isActive))
    );
  }
}
