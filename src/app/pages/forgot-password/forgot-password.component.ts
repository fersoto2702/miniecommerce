import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {

  email = '';
  newPassword = '';

  errorMessage = '';
  successMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  resetPassword() {
    this.errorMessage = '';
    this.successMessage = '';

    const result = this.auth.resetPassword(this.email, this.newPassword);

    if (!result.ok) {
      this.errorMessage = result.message;
      return;
    }

    this.successMessage = 'Contraseña actualizada correctamente ✔';
  }
}