import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProductService } from '../../../services/admin-product.service';
import { NotificationService } from '../../../services/notification.service';
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
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private adminPs: AdminProductService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (isNaN(id) || id <= 0) {
      this.notificationService.error(
        'ID de producto inválido',
        3000,
        'Error'
      );
      this.router.navigate(['/admin/products']);
      return;
    }
    
    this.loadProduct(id);
  }

  // ============================================================
  // 🔵 Cargar producto desde backend
  // ============================================================
  loadProduct(id: number) {
    this.loading = true;
    this.notificationService.info('Cargando datos del producto...', 0);

    this.adminPs.getById(id).subscribe({
      next: (res: any) => {
        this.product = res.product || res;
        this.loading = false;
        
        this.notificationService.success(
          `Producto "${this.product.name}" cargado correctamente`,
          2500,
          '¡Listo!'
        );
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        this.loading = false;
        
        if (err.status === 404) {
          this.notificationService.error(
            'El producto no existe o fue eliminado',
            4000,
            'Producto no encontrado'
          );
        } else if (err.status === 403) {
          this.notificationService.error(
            'No tienes permisos para ver este producto',
            4000,
            'Acceso denegado'
          );
        } else {
          this.notificationService.error(
            'No se pudo cargar el producto',
            4000,
            'Error al cargar'
          );
        }
        
        setTimeout(() => {
          this.router.navigate(['/admin/products']);
        }, 2000);
      }
    });
  }

  // ============================================================
  // 🔵 Guardar cambios (PUT /api/products/:id)
  // ============================================================
  save() {
    if (!this.product) {
      this.notificationService.warning(
        'No hay datos del producto para guardar',
        3000
      );
      return;
    }

    // Validaciones
    if (!this.product.name || this.product.name.trim() === '') {
      this.notificationService.warning(
        'El nombre del producto es obligatorio',
        3000,
        'Campo requerido'
      );
      return;
    }

    if (!this.product.price || this.product.price <= 0) {
      this.notificationService.warning(
        'El precio debe ser mayor a 0',
        3000,
        'Precio inválido'
      );
      return;
    }

    if (this.product.stock < 0) {
      this.notificationService.warning(
        'El stock no puede ser negativo',
        3000,
        'Stock inválido'
      );
      return;
    }

    this.saving = true;
    this.notificationService.info('Guardando cambios...', 0);

    this.adminPs.update(this.product.id, this.product).subscribe({
      next: () => {
        this.saving = false;
        
        this.notificationService.success(
          `¡${this.product.name} ha sido actualizado exitosamente!`,
          3000,
          '¡Producto Actualizado!'
        );
        
        setTimeout(() => {
          this.router.navigate(['/admin/products']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.saving = false;
        
        if (err.status === 403) {
          this.notificationService.error(
            'No tienes permisos de administrador para actualizar productos',
            4000,
            'Acceso denegado'
          );
        } else if (err.status === 404) {
          this.notificationService.error(
            'El producto ya no existe en la base de datos',
            4000,
            'Producto no encontrado'
          );
        } else if (err.status === 400) {
          this.notificationService.error(
            'Los datos enviados son inválidos. Revisa el formulario.',
            4000,
            'Datos inválidos'
          );
        } else {
          this.notificationService.error(
            'Ocurrió un error al actualizar el producto',
            4000,
            'Error al guardar'
          );
        }
      }
    });
  }

  // ============================================================
  // 🔵 Cancelar edición
  // ============================================================
  cancel() {
    this.notificationService.info(
      'Edición cancelada. Regresando a la lista de productos...',
      2000
    );
    
    setTimeout(() => {
      this.router.navigate(['/admin/products']);
    }, 500);
  }

  // ============================================================
  // 🔵 Vista previa de imagen
  // ============================================================
  onImageUrlChange() {
    if (this.product?.imageUrl) {
      this.notificationService.info(
        'Vista previa de imagen actualizada',
        1500
      );
    }
  }
}