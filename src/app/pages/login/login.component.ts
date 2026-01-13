/* login.component.ts */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  email = '';
  password = '';
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private auth: AuthService, 
    private router: Router,
    private notificationService: NotificationService
  ) {}

  submit() {
    this.errorMessage = '';
    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;

        if (!res.ok) {
          this.errorMessage = res.message;
          this.notificationService.error(res.message || 'Error al iniciar sesión 🔥');
          return;
        }

        // ✨ Obtener datos del usuario
        const userRole = res.user?.role || 'user';
        const userName = res.user?.name || 'Usuario';

        // 🎯 NOTIFICACIÓN SEGÚN EL ROL
        if (userRole === 'admin') {
          // Notificación para ADMIN
          this.notificationService.success(
            `¡Bienvenido ${userName}! Acceso al panel de administración 👑`,
            3000,
            'Admin'
          );
        } else {
          // Notificación para USUARIO normal
          this.notificationService.success(
            `¡Bienvenido ${userName}! Disfruta de tu aventura Pokémon ⚡`,
            3000,
            'Entrenador'
          );
        }

        // Redirección según rol
        setTimeout(() => {
          if (userRole === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigateByUrl('/home');
          }
        }, 1500); // Aumentado a 1.5s para que se vea la notificación
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.errorMessage = err.error?.message || 'Error en el servidor';
        
        // Notificaciones específicas según el tipo de error
        if (err.status === 401) {
          this.notificationService.error(
            'Email o contraseña incorrectos 🔥',
            4000,
            'Credenciales inválidas'
          );
        } else if (err.status === 404) {
          this.notificationService.error(
            'Usuario no encontrado. ¿Ya te registraste? 🔥',
            4000,
            'Usuario no existe'
          );
        } else if (err.status === 0) {
          this.notificationService.error(
            'No se puede conectar al servidor. Verifica tu conexión 🔥',
            4000,
            'Error de conexión'
          );
        } else {
          this.notificationService.error(
            err.error?.message || 'Error en el servidor. Intenta de nuevo 🔥',
            4000,
            'Error'
          );
        }
      }
    });
  }
}