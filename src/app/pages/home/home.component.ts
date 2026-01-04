import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  featured: any[] = [];

  constructor(private ps: ProductService) {}

  ngOnInit() {
    this.ps.getAll().subscribe({
      next: (res: any) => {
        const products = res.products || res; // backend o mock
        this.featured = Array.isArray(products)
          ? products.slice(0, 6)
          : [];
      },
      error: () => {
        this.featured = [];
      }
    });
  }
}