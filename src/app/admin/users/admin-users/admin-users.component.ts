import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {

  users: any[] = [];
  loading = false;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  // =================================================
  // 🔵 Cargar usuarios desde el BACKEND
  // =================================================
  loadUsers() {
    this.loading = true;

    this.userService.getAllUsers().subscribe({
      next: (res: any) => {
        // Manejo flexible de la respuesta (Array o Objeto con propiedad users)
        if (Array.isArray(res)) {
          this.users = res;
        } else if (res && res.users) {
          this.users = res.users;
        } else {
          this.users = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.notificationService.error('Error al cargar usuarios (¿Sesión expirada?)');
        this.loading = false;
      }
    });
  }

  // =================================================
  // ➕ Navegar a la creación de usuario
  // =================================================
  createNewUser() {
    // Usamos la ruta corregida que definimos en app.routes.ts
    this.router.navigate(['/admin/users/create']);
  }

  // Getters para las estadísticas del footer
  get totalAdmins(): number {
    return this.users.filter(u => u.role === 'admin').length;
  }

  get totalUsers(): number {
    return this.users.filter(u => u.role === 'user').length;
  }
}