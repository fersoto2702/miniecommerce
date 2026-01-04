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
  loading = false;

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
        this.loading = false;
      },
      error: () => {
        alert('Error al cargar productos');
        this.loading = false;
      }
    });
  }

  onSearch(term: string) {
    const q = term.toLowerCase().trim();

    if (!q) {
      this.filtered = [...this.products];
      return;
    }

    this.filtered = this.products.filter(p =>
      (p.name ?? '').toLowerCase().includes(q) ||
      (p.category ?? '').toLowerCase().includes(q)
    );
  }
}