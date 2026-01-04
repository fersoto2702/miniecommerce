import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {

  users: any[] = [];
  loading = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  // =================================================
  // 🔵 Cargar usuarios desde el BACKEND
  // GET /api/auth/users  (solo admin)
  // =================================================
  loadUsers() {
    this.loading = true;

    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res.users || [];
        this.loading = false;
      },
      error: () => {
        alert('Error al cargar usuarios (¿Eres admin?)');
        this.loading = false;
      }
    });
  }

   // Getters para contar usuarios por rol
  get totalAdmins(): number {
    return this.users.filter(u => u.role === 'admin').length;
  }

  get totalUsers(): number {
    return this.users.filter(u => u.role === 'user').length;
  }
}