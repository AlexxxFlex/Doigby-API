import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map, mergeMap} from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Products`;

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getProductBySlug(slug: string): Observable<any> {
    return this.getProducts().pipe(
      map(products => products.find(p => p.slug === slug))
    );
  }

  getProductVariant(productId: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${productId}/variants`).pipe(
      map(variants => variants[0])
    );
  }

  getProductWithVariant(productId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${productId}`);
  }

  getProductWithVariantBySlug(slug: string): Observable<any> {
    return this.getProductBySlug(slug).pipe(
      mergeMap(product => {
        if (!product) throw new Error('Product not found');
        return this.http.get<any>(`${this.apiUrl}/${product.id}`);
      })
    );
  }

  getAllProductsStock(): Observable<any[]> {
    return this.getProducts().pipe(
      map(products => products.filter(p => p.isActive))
    );
  }
}
