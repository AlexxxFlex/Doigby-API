import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getProducts(): any {
    return this.http.get(`${this.apiUrl}/products`);
  }
}
