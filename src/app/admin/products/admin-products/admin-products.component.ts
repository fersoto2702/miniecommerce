import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminProductService } from '../../../services/admin-product.service';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminSidebarComponent],
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent {

  products:any[] = [];

  constructor(private adminPs: AdminProductService) {
    this.products = adminPs.getAll();
  }

  delete(id:number){
    this.adminPs.delete(id);
    this.products = this.adminPs.getAll();
  }
}