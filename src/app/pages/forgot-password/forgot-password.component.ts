// forgot-password.component.ts

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  email = '';
  newPassword = '';

  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private auth: AuthService) {}

  // ======================================
  // 🚀 RESET PASSWORD – CORRECTO
  // ======================================
  resetPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    // ==========================
    // VALIDACIONES LOCALES
    // ==========================
    if (!this.email.trim() || !this.newPassword.trim()) {
      this.errorMessage = 'Todos los campos son obligatorios.';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'El correo no es válido.';
      return;
    }

    if (!this.validatePassword(this.newPassword)) {
      this.errorMessage =
        'La contraseña debe tener mínimo 6 caracteres, incluir mayúsculas, minúsculas, un número y un símbolo.';
      return;
    }

    this.loading = true;

    // =======================================
    // 🚀 LLAMADA REAL AL BACKEND (CORRECTA)
    // =======================================
    this.auth.resetPassword(this.email, this.newPassword).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (!res.ok) {
          this.errorMessage = res.message;
          return;
        }

        this.successMessage = 'Contraseña actualizada correctamente ✔';
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Error en el servidor';
      }
    });
  }

  // ======================================
  // 🔵 VALIDACIÓN DE EMAIL
  // ======================================
  validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email.toLowerCase());
  }

  // ======================================
  // 🔵 VALIDACIÓN DE PASSWORD (CORREGIDA)
  // ======================================
  validatePassword(pass: string): boolean {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.\-!#$%&])[A-Za-z\d@.\-!#$%&]{6,}$/;
  return regex.test(pass);
}

  showPassword = false;

  tooglePassword() {
    this.showPassword = !this.showPassword;
  }

}