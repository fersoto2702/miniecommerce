import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProductService } from '../../../services/admin-product.service';
import { NotificationService } from '../../../services/notification.service';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './admin-create-product.component.html'
})
export class AdminCreateProductComponent {
  
  product = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: ''
  };

  loading = false;

  constructor(
    private adminPs: AdminProductService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  save() {
    // Validación
    if (!this.product.name || this.product.price <= 0) {
      this.notificationService.warning(
        'Por favor completa el nombre y el precio del producto',
        3000,
        'Campos requeridos'
      );
      return;
    }

    this.loading = true;
    this.notificationService.info('Capturando producto...', 0);

    this.adminPs.create(this.product).subscribe({
      next: () => {
        this.notificationService.success(
          `¡${this.product.name} ha sido capturado exitosamente!`,
          3000,
          '¡Producto Creado!'
        );
        setTimeout(() => {
          this.router.navigate(['/admin/products']);
        }, 1000);
      },
      error: (err) => {
        console.error('Error al crear producto:', err);
        this.notificationService.error(
          'No se pudo crear el producto. Verifica los datos e intenta nuevamente.',
          4000,
          'Error al Capturar'
        );
        this.loading = false;
      }
    });
  }

  cancel() {
    this.notificationService.info('Operación cancelada', 2000);
    this.router.navigate(['/admin/products']);
  }
}