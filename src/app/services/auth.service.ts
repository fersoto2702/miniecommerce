// auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  // Verifica si existe window/localStorage (evita errores en SSR)
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Cargar usuario guardado en localStorage
  private loadUserFromStorage() {
    if (!this.isBrowser()) return;

    const saved = localStorage.getItem('user');
    if (saved) {
      this.userSubject.next(JSON.parse(saved));
    }
  }

  // ---------------------------------------------------------------------
  // LOGIN — usuarios definidos + usuarios registrados dinámicamente
  // ---------------------------------------------------------------------
  login(email: string, password: string) {
    // 1) Admin fijo
    if (email === 'admin@mail.com' && password === '123456') {
      const user = { name: 'Administrador', email, role: 'admin' };
      this.saveUser(user);
      return { ok: true, message: 'Login exitoso', user };
    }

    // 2) Usuario normal fijo
    if (email === 'user@mail.com' && password === '123456') {
      const user = { name: 'Usuario Normal', email, role: 'user' };
      this.saveUser(user);
      return { ok: true, message: 'Login exitoso', user };
    }

    // 3) Usuarios registrados manualmente
    const listRaw = localStorage.getItem('registered_users');
    const users = listRaw ? JSON.parse(listRaw) : [];

    const match = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (match) {
      // Usuario registrado dinámicamente
      this.saveUser(match);
      return { ok: true, message: 'Login exitoso', user: match };
    }

    return { ok: false, message: 'Credenciales incorrectas' };
  }

  // ---------------------------------------------------------------------
  // REGISTRO — guarda usuarios en localStorage
  // ---------------------------------------------------------------------
  register(name: string, email: string, password: string) {
    if (!this.isBrowser()) {
      return { ok: false, message: 'No disponible fuera del navegador' };
    }

    // Leer usuarios existentes
    const listRaw = localStorage.getItem('registered_users');
    const users = listRaw ? JSON.parse(listRaw) : [];

    // Validar si el correo ya existe
    const exists = users.find((u: any) => u.email === email);
    if (exists) {
      return { ok: false, message: 'El correo ya está registrado.' };
    }

    // Crear usuario
    const newUser = {
      name,
      email,
      password,
      role: 'user'
    };

    users.push(newUser);

    localStorage.setItem('registered_users', JSON.stringify(users));

    return { ok: true, message: 'Registro exitoso', user: newUser };
  }

  // ---------------------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------------------
  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);
  }

  // ---------------------------------------------------------------------
  // GUARDAR USUARIO EN LOCALSTORAGE
  // ---------------------------------------------------------------------
  private saveUser(user: any) {
    if (this.isBrowser()) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.userSubject.next(user);
  }

  // ---------------------------------------------------------------------
  // OBTENER USUARIO ACTUAL
  // ---------------------------------------------------------------------
  getCurrentUser() {
    return this.userSubject.value;
  }

  resetPassword(email: string, newPassword: string) {
  if (!this.isBrowser()) {
    return { ok: false, message: 'No disponible fuera del navegador' };
  }

  const usersRaw = localStorage.getItem('registered_users');
  let users = usersRaw ? JSON.parse(usersRaw) : [];

  const userIndex = users.findIndex((u: any) => u.email === email);

  if (userIndex === -1) {
    return { ok: false, message: 'El correo no está registrado.' };
  }

  // Validación mínima (puedo agregarte regex si quieres)
  if (newPassword.length < 6) {
    return { ok: false, message: 'La contraseña debe tener mínimo 6 caracteres.' };
  }

  // Actualizar contraseña
  users[userIndex].password = newPassword;

  localStorage.setItem('registered_users', JSON.stringify(users));

  return { ok: true, message: 'Contraseña actualizada' };
}
}