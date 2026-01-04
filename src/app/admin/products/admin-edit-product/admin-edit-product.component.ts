import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProductService } from '../../../services/admin-product.service';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './admin-edit-product.component.html'
})
export class AdminEditProductComponent implements OnInit {

  product: any = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private adminPs: AdminProductService,   // ← ✔ CORREGIDO
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct(id);
  }

  // ============================================================
  // 🔵 Cargar producto desde backend
  // ============================================================
  loadProduct(id: number) {
    this.loading = true;

    this.adminPs.getById(id).subscribe({
      next: (res: any) => {
        this.product = res.product || res;
        this.loading = false;
      },
      error: () => {
        alert('Error al cargar producto');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  // ============================================================
  // 🔵 Guardar cambios (PUT /api/products/:id)
  // ============================================================
  save() {
    if (!this.product) return;

    this.adminPs.update(this.product.id, this.product).subscribe({
      next: () => {
        alert('Producto actualizado correctamente');
        this.router.navigate(['/admin/products']);
      },
      error: () => {
        alert('Error al actualizar el producto (requiere permisos de admin)');
      }
    });
  }
}