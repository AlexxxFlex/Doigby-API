import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, forkJoin, map, mergeMap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }

  getProductBySlug(slug: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/products?slug=${slug}`).pipe(
      map(products => products[0])
    );
  }

  getProductVariant(productId: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/product-variants?productId=${productId}`).pipe(
      map(variants => variants[0])
    );
  }

  getProductWithVariant(productId: string): Observable<any> {
    return forkJoin({
      product: this.http.get<any>(`${this.apiUrl}/products/${productId}`),
      variant: this.getProductVariant(productId)
    }).pipe(
      map(({product, variant}) => ({
        ...product,
        ...variant
      }))
    );
  }

  getProductWithVariantBySlug(slug: string): Observable<any> {
    return this.getProductBySlug(slug).pipe(
      map(product => {
        if (!product) throw new Error('Product not found');
        return product;
      }),
      map(product => 
        forkJoin({
          product: this.http.get<any>(`${this.apiUrl}/products/${product.id}`),
          variant: this.getProductVariant(product.id)
        })
      ),
      map(obs => obs.pipe(
        map(({product, variant}) => ({
          ...product,
          ...variant
        }))
      ))
    ).pipe(
      mergeMap(obs => obs)
    );
  }

  getAllProductsStock(): Observable<any[]> {
    return forkJoin({
      products: this.getProducts(),
      variants: this.http.get<any[]>(`${this.apiUrl}/product-variants`)
    }).pipe(
      map(({products, variants}) => {
        return products.map(product => {
          const variant = variants.find(v => v.productId === product.id);
          return {
            ...product,
            stock: variant?.stock || 0
          };
        });
      })
    );
  }
}
