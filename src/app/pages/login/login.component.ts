/* login.component.ts */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service'; // ← NUEVO

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

  constructor(
    private auth: AuthService, 
    private router: Router,
    private notificationService: NotificationService // ← NUEVO
  ) {}

  submit() {
    this.errorMessage = '';
    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;

        if (!res.ok) {
          this.errorMessage = res.message;
          // Notificación de error estilo Pokémon
          this.notificationService.error(res.message || 'Error al iniciar sesión 🔥');
          return;
        }

        // ✨ ÉXITO - Notificación Pokémon (REEMPLAZA EL ALERT)
        this.notificationService.success('¡Login exitoso! Bienvenido Administrador ⚡');

        // Redirección según rol
        setTimeout(() => {
            if (res.user.role === 'admin') {
                this.router.navigate(['/admin']);
            } else {
                this.router.navigateByUrl('/home');
            }
        }, 50);

      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.errorMessage = err.error?.message || 'Error en el servidor';
        
        // Notificación de error del servidor estilo Pokémon
        this.notificationService.error(
          err.error?.message || 'Error en el servidor. Intenta de nuevo 🔥'
        );
      }
    });
  }
}