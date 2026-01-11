import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AdminProductService } from '../../../services/admin-product.service';
import { NotificationService } from '../../../services/notification.service';
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
    private adminPs: AdminProductService,
    private notificationService: NotificationService, // ← Inyectar servicio
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
        
        // Notificación de éxito al cargar (opcional)
        if (this.products.length > 0) {
          this.notificationService.info(
            `Se cargaron ${this.products.length} productos`,
            2000
          );
        }
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.notificationService.error(
          'No se pudieron cargar los productos',
          4000,
          '¡Oh no!'
        );
        this.loading = false;
      }
    });
  }

  // =====================================================
  // 🔴 Eliminar producto (solo admin) - CON CONFIRMACIÓN
  // =====================================================
  delete(id: number) {
    // Mostrar notificación de confirmación
    this.notificationService.warning(
      '¿Estás seguro de eliminar este producto?',
      0, // Sin duración para que no desaparezca
      'Confirmar eliminación'
    );

    // Usar confirm nativo (temporal)
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) {
      this.notificationService.info('Eliminación cancelada', 2000);
      return;
    }

    // Mostrar notificación de carga
    this.notificationService.info('Eliminando producto...', 0);

    this.adminPs.delete(id).subscribe({
      next: () => {
        // Notificación de éxito
        this.notificationService.success(
          'El producto ha sido eliminado correctamente',
          3000,
          '¡Éxito!'
        );
        this.loadProducts(); 
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        
        // Notificación de error específica
        if (err.status === 403) {
          this.notificationService.error(
            'No tienes permisos para eliminar este producto',
            4000,
            'Acceso denegado'
          );
        } else if (err.status === 404) {
          this.notificationService.error(
            'El producto no existe o ya fue eliminado',
            4000,
            'Producto no encontrado'
          );
        } else {
          this.notificationService.error(
            'Ocurrió un error al eliminar el producto',
            4000,
            'Error'
          );
        }
      }
    });
  }

  // =====================================================
  // 🔵 Ir a editar un producto
  // =====================================================
  edit(id: number) {
    this.notificationService.info('Cargando editor...', 1500);
    this.router.navigate(['/admin/products/edit', id]);
  }

  // =====================================================
  // 🟢 Ir a crear un producto nuevo
  // =====================================================
  create() {
    this.notificationService.info('Preparando formulario de creación...', 1500);
    this.router.navigate(['/admin/products/create']);
  }
}