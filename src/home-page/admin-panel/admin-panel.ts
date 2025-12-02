import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductApiService, Product, CreateProductDto, UpdateProductDto, ApiCategory } from '../../services/product-api-service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanelComponent implements OnInit {
  private productService = inject(ProductApiService);
  private router = inject(Router);

  showCreateModal = false;
  showEditModal = false;
  showDeleteConfirm = false;
  
  products: Product[] = [];
  categories: ApiCategory[] = [];
  selectedProduct: Product | null = null;
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  formData: CreateProductDto = {
    name: '',
    slug: '',
    description: '',
    basePrice: 0,
    isActive: true,
    categoryId: 1
  };

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des produits';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des catégories:', err);
      }
    });
  }

  // Create Product
  openCreateModal(): void {
    this.resetForm();
    this.showCreateModal = true;
    this.clearMessages();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetForm();
  }

  createProduct(): void {
    if (!this.validateForm()) return;

    this.isLoading = true;
    this.clearMessages();

    this.productService.createProduct(this.formData).subscribe({
      next: () => {
        this.successMessage = 'Produit créé avec succès!';
        this.closeCreateModal();
        this.loadProducts();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la création du produit';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Edit Product
  openEditModal(product: Product): void {
    this.selectedProduct = product;
    this.formData = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      basePrice: product.basePrice,
      isActive: product.isActive,
      categoryId: product.categoryId
    };
    this.showEditModal = true;
    this.clearMessages();
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedProduct = null;
    this.resetForm();
  }

  updateProduct(): void {
    if (!this.selectedProduct || !this.validateForm()) return;

    this.isLoading = true;
    this.clearMessages();

    const updateData: UpdateProductDto = {
      name: this.formData.name,
      slug: this.formData.slug,
      description: this.formData.description,
      basePrice: this.formData.basePrice,
      isActive: this.formData.isActive,
      categoryId: this.formData.categoryId
    };

    this.productService.updateProduct(this.selectedProduct.id, updateData).subscribe({
      next: () => {
        this.successMessage = 'Produit mis à jour avec succès!';
        this.closeEditModal();
        this.loadProducts();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la mise à jour du produit';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Delete Product
  openDeleteConfirm(product: Product): void {
    this.selectedProduct = product;
    this.showDeleteConfirm = true;
    this.clearMessages();
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.selectedProduct = null;
  }

  deleteProduct(): void {
    if (!this.selectedProduct) return;

    this.isLoading = true;
    this.clearMessages();

    this.productService.deleteProduct(this.selectedProduct.id).subscribe({
      next: () => {
        this.successMessage = 'Produit supprimé avec succès!';
        this.closeDeleteConfirm();
        this.loadProducts();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la suppression du produit';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Helpers
  generateSlug(): void {
    this.formData.slug = this.formData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private resetForm(): void {
    this.formData = {
      name: '',
      slug: '',
      description: '',
      basePrice: 0,
      isActive: true,
      categoryId: this.categories.length > 0 ? this.categories[0].data.id : 1
    };
  }

  private validateForm(): boolean {
    if (!this.formData.name.trim()) {
      this.errorMessage = 'Le nom du produit est requis';
      return false;
    }
    if (!this.formData.slug.trim()) {
      this.errorMessage = 'Le slug est requis';
      return false;
    }
    if (this.formData.basePrice < 0) {
      this.errorMessage = 'Le prix doit être positif';
      return false;
    }
    return true;
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}