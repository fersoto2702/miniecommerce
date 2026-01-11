import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProductService } from '../../../services/admin-product.service';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './admin-create-product.component.html',
  styleUrls: ['./admin-create-product.component.css'],
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
    private router: Router
  ) {}

  save() {
    if (!this.product.name || this.product.price <= 0) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    this.loading = true;

    this.adminPs.create(this.product).subscribe({
      next: () => {
        alert('✅ Producto creado exitosamente');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('Error al crear producto:', err);
        alert('❌ Error al crear producto. Verifica la consola.');
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }
}