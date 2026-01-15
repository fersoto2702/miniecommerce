import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductService } from '../../services/product.service';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductListComponent, SearchBarComponent],
  templateUrl: './productos.component.html'
})
export class ProductsComponent implements OnInit {

  products: any[] = [];
  filtered: any[] = [];
  paginated: any[] = [];

  loading = false;
  searchTerm = '';

  // Paginación
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 0;

  // Para usar Math en el template
  Math = Math;

  constructor(private ps: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  // ============================
  // 📦 Cargar productos
  // ============================
  loadProducts() {
    this.loading = true;

    this.ps.getAll().subscribe({
      next: (res: any) => {
        this.products = res.products || res;
        this.filtered = [...this.products];
        this.setupPagination();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.loading = false;
      }
    });
  }

  // ============================
  // 🔍 Búsqueda
  // ============================
  onSearch(term: string) {
    this.searchTerm = term;
    const q = term.toLowerCase().trim();

    if (!q) {
      this.filtered = [...this.products];
    } else {
      this.filtered = this.products.filter(p =>
        (p.name ?? '').toLowerCase().includes(q) ||
        (p.desc ?? '').toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q)
      );
    }

    this.currentPage = 1;
    this.setupPagination();
  }

  // ============================
  // ❌ Limpiar búsqueda
  // ============================
  clearSearch() {
    this.searchTerm = '';
    this.filtered = [...this.products];
    this.currentPage = 1;
    this.setupPagination();
  }

  // ============================
  // 📄 Configurar paginación
  // ============================
  setupPagination() {
    this.totalPages = Math.ceil(this.filtered.length / this.itemsPerPage);
    this.updatePaginated();
  }

  updatePaginated() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginated = this.filtered.slice(start, end);
  }

  // ============================
  // 🔢 Ir a página
  // ============================
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginated();
    
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============================
  // 📊 Cambiar items por página
  // ============================
  onPageSizeChange() {
    this.currentPage = 1;
    this.setupPagination();
  }

  // ============================
  // 🔢 Obtener números de página visibles
  // ============================
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5; // Máximo de números visibles
    
    if (this.totalPages <= maxVisible) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas alrededor de la actual
      if (this.currentPage <= 3) {
        // Inicio: mostrar 1, 2, 3, 4, 5
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (this.currentPage >= this.totalPages - 2) {
        // Final: mostrar últimas 5 páginas
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Medio: mostrar página actual con 2 a cada lado
        for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  }

  // ============================
  // 📈 Obtener rango de items mostrados
  // ============================
  get currentRangeStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get currentRangeEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filtered.length);
  }

  // ============================
  // 🔄 Refrescar productos
  // ============================
  refresh() {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadProducts();
  }
}