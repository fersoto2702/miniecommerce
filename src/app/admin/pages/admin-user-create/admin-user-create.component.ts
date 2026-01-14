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

  // ⚡ LÓGICA POWER PASSWORD
  generateAIPassword(): void {
  if (!this.user.name) {
    this.notificationService.warning('Ingresa un nombre para usar como semilla');
    return;
  }

  // 1. Base del nombre
  const base = this.user.name.trim().toLowerCase().split(' ')[0];
  
  // 2. Elementos aleatorios
  const symbols = ['#', '$', '!', '@', '*', '&', '?', '¿', '¡', '+'];
  const suffixes = ['Pro', 'Safe', 'X', 'Auth', 'Key', 'Secure', 'Top'];
  
  const randomChar = symbols[Math.floor(Math.random() * symbols.length)];
  const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const randomNum = Math.floor(Math.random() * 90) + 10; // Genera número entre 10 y 99

  // 3. Construcción dinámica
  // Resultado Ej: Juan!82Safe, Juan*45Pro, Juan@12Key
  this.user.password = 
    base.charAt(0).toUpperCase() + 
    base.slice(1) + 
    randomChar + 
    randomNum + 
    randomSuffix;
  
  this.notificationService.success('Nueva contraseña inteligente generada');
}

  createUser() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.notificationService.warning('Por favor, completa todos los campos');
      return;
    }

    this.loading = true;

    this.userService.createUser(this.user).subscribe({
      next: () => {
        this.notificationService.success('¡Usuario registrado exitosamente!');
        this.router.navigate(['/admin/users']); 
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al crear usuario:', err);
        const errorMsg = err.error?.message || 'No se pudo crear el usuario';
        this.notificationService.error(errorMsg);
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/users']);
  }
}