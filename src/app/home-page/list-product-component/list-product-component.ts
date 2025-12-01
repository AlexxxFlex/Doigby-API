import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardProductComponent } from '../card-product-component/card-product-component';

@Component({
  selector: 'app-list-product',
  imports: [CommonModule, CardProductComponent],
  templateUrl: './list-product-component.html',
  styleUrl: './list-product-component.css',
})
export class ListProductComponent {
  @Input() products: any[] = [];
  @Input() categoryName: string = '';
  @Output() productSelected = new EventEmitter<any>();

  onProductSelected(product: any): void {
    this.productSelected.emit(product);
  }
}