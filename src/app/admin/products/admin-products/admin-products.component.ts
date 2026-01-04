import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminProductService } from '../../../services/admin-product.service';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminSidebarComponent],
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent implements OnInit {

  products: any[] = [];
  loading = false;

  constructor(
    private adminPs: AdminProductService,   // ← ✔ CORREGIDO
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  // =====================================================
  // 🔵 Cargar productos desde el BACKEND (admin)
  // =====================================================
  loadProducts() {
    this.loading = true;

    this.adminPs.getAll().subscribe({
      next: (res: any) => {
        this.products = res.products || res;
        this.loading = false;
      },
      error: () => {
        alert('Error al obtener productos');
        this.loading = false;
      }
    });
  }

  // =====================================================
  // 🔴 Eliminar producto (solo admin)
  // =====================================================
  delete(id: number) {
    if (!confirm('¿Eliminar este producto?')) return;

    this.adminPs.delete(id).subscribe({
      next: () => {
        alert('Producto eliminado');
        this.loadProducts(); 
      },
      error: () =>
        alert('Error al eliminar producto (requiere permisos de admin)')
    });
  }

  // =====================================================
  // 🔵 Ir a editar un producto
  // =====================================================
  edit(id: number) {
    this.router.navigate(['/admin/products/edit', id]);
  }

  // =====================================================
  // 🟢 Ir a crear un producto nuevo
  // =====================================================
  create() {
    this.router.navigate(['/admin/products/create']);
  }
}