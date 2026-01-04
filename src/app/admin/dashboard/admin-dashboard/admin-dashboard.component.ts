import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { ProductService } from '../../../services/product.service';
import { UserService } from '../../../services/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {

  totalProducts = 0;
  totalUsers = 0;
  totalOrders = 0; // 🔜 para futuras órdenes

  loading = true;

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    forkJoin({
      products: this.productService.getAll(),
      users: this.userService.getAllUsers()
    }).subscribe({
      next: ({ products, users }) => {
        this.totalProducts = products.length;
        this.totalUsers = users.users?.length || 0;
        this.loading = false;
      },
      error: () => {
        this.totalProducts = 0;
        this.totalUsers = 0;
        this.loading = false;
      }
    });
  }
}