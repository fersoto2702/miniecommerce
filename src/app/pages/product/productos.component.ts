import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductService } from '../../services/product.service';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductListComponent, SearchBarComponent],
  templateUrl: './productos.component.html'   // o './productos.component.html' según tu archivo
})
export class ProductsComponent implements OnInit {

  products: any[] = [];
  filtered: any[] = [];

  constructor(private ps: ProductService) {}

  ngOnInit() {
    this.products = this.ps.getAll();
    this.filtered = [...this.products];
  }

  // 👉 se llama cuando das Enter o clic en "Buscar"
  onSearch(term: string) {
    const q = term.toLowerCase().trim();

    if (!q) {
      this.filtered = [...this.products];
      return;
    }

    this.filtered = this.products.filter(p => {
      const name      = (p.name ?? '').toLowerCase();
      const category  = (p.category ?? '').toLowerCase();

      // fields opcionales dentro de details
      const pantalla  = (p.details?.pantalla ?? '').toLowerCase();
      const camara    = (p.details?.camara ?? '').toLowerCase();
      const proc      = (p.details?.procesador ?? '').toLowerCase();

      return (
        name.includes(q) ||
        category.includes(q) ||
        pantalla.includes(q) ||
        camara.includes(q) ||
        proc.includes(q)
      );
    });
  }
}