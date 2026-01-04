import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';

  errorMessage = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.errorMessage = '';

    // VALIDACIONES SIMPLES
    if (!this.name || !this.email || !this.password) {
      return this.setError('Todos los campos son obligatorios.');
    }

    if (!this.validateEmail(this.email)) {
      return this.setError('El correo no es válido.');
    }

    this.loading = true;

    // LLAMAR AL BACKEND REAL
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: (res: any) => {
        this.loading = false;

        if (!res.ok) {
          this.errorMessage = res.message;
          return;
        }

        alert('Registro exitoso 🎉 Ahora puedes iniciar sesión');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.errorMessage = err.error?.message || 'Error en el servidor';
      }
    });
  }

  // EMAIL validación simple
  validateEmail(email: string): boolean {
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return regex.test(email);
  }

  setError(msg: string) {
    this.errorMessage = msg;
  }
}