/* register.component.ts */

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

    // VALIDACIONES
    if (!this.name || !this.email || !this.password) {
      return this.setError('Todos los campos son obligatorios.');
    }

    if (!this.validateEmail(this.email)) {
      return this.setError('El correo no es válido o no termina en .com');
    }

    if (!this.validatePassword(this.password)) {
      return this.setError(
        'La contraseña debe tener 8-20 caracteres, incluir mayúsculas, minúsculas, un número y un símbolo.'
      );
    }

    this.loading = true;

    // LLAMADA AL SERVICIO SIMULADO
    const r = this.auth.register(this.name, this.email, this.password);
    this.loading = false;

    if (!r.ok) {
      return this.setError(r.message);
    }

    alert('Registro exitoso 🎉 Ahora puedes iniciar sesión');
    this.router.navigate(['/login']);
  }

  // EMAIL: formato correcto + debe terminar en .com
  validateEmail(email: string): boolean {
  // Estructura básica válida: nombre@dominio.com
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Debe terminar en .com
  if (!email.endsWith('.com')) return false;

  // No debe tener @. (que es tu problema real)
  if (email.includes('@.')) return false;

  // No debe tener dos puntos seguidos
  if (email.includes('..')) return false;

  return regex.test(email);
}

  // PASSWORD: 8-20 chars, 1 número, 1 mayúscula, 1 minúscula, 1 símbolo
  validatePassword(pass: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.\-_!@#$%&*])[A-Za-z\d.\-_!@#$%&*]{8,20}$/;
    return regex.test(pass);
  }

  setError(msg: string) {
    this.errorMessage = msg;
  }
}