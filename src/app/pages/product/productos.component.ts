import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductService } from '../../services/product.service';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductListComponent, SearchBarComponent],
  templateUrl: './productos.component.html'
})
export class ProductsComponent implements OnInit {

  products: any[] = [];
  filtered: any[] = [];
  paginated: any[] = [];

  loading = false;

  // 🔹 Paginación
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;

  constructor(private ps: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;

    this.ps.getAll().subscribe({
      next: (res: any) => {
        this.products = res.products || res;
        this.filtered = [...this.products];
        this.setupPagination();
        this.loading = false;
      },
      error: () => {
        alert('Error al cargar productos');
        this.loading = false;
      }
    });
  }

  // 🔹 BUSCADOR
  onSearch(term: string) {
    const q = term.toLowerCase().trim();

    if (!q) {
      this.filtered = [...this.products];
    } else {
      this.filtered = this.products.filter(p =>
        (p.name ?? '').toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
      );
    }

    this.currentPage = 1;
    this.setupPagination();
  }

  // 🔹 PAGINACIÓN
  setupPagination() {
    this.totalPages = Math.ceil(this.filtered.length / this.itemsPerPage);
    this.updatePaginated();
  }

  updatePaginated() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginated = this.filtered.slice(start, end);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginated();
  }
}