import { Injectable, signal } from '@angular/core';

export interface CartItem {
  product: any;
  size: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  getCartItems() {
    return this.cartItems();
  }

  addToCart(product: any, size: string) {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(
      item => item.product.id === product.id && item.size === size
    );

    if (existingItem) {
      existingItem.quantity++;
      this.cartItems.set([...currentItems]);
    } else {
      this.cartItems.set([...currentItems, { product, size, quantity: 1 }]);
    }
  }

  removeFromCart(productId: string, size: string) {
    const currentItems = this.cartItems();
    this.cartItems.set(
      currentItems.filter(
        item => !(item.product.id === productId && item.size === size)
      )
    );
  }

  getCartCount() {
    return this.cartItems().reduce((total, item) => total + item.quantity, 0);
  }
}