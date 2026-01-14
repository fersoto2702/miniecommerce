import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-admin-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './admin-user-create.component.html'
})
export class AdminUserCreateComponent {
  user = {
    name: '',
    email: '',
    password: '',
    role: 'user'
  };

  loading = false;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  createUser() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.notificationService.warning('Todos los campos son requeridos');
      return;
    }

    this.loading = true;

    this.userService.createUser(this.user).subscribe({
      next: () => {
        this.notificationService.success('¡Usuario creado con éxito!');
        // Redirigimos a la tabla. El ngOnInit de AdminUsersComponent se encargará de refrescar la lista.
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        const msg = err.error?.message || 'Error al crear el usuario';
        this.notificationService.error(msg);
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/users']);
  }
}