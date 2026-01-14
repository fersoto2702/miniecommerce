import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURL = 'http://localhost:4000/api/auth';

  constructor(private http: HttpClient) {}

  // ============================================
  // 🔹 Obtener TODOS los usuarios (solo admin)
  // GET /api/auth/users
  // ============================================
  getAllUsers(): Observable<any> {
  // 1. Obtenemos el token y nos aseguramos de que sea un string (si es null, usamos '')
  const token = localStorage.getItem('token') || ''; 

  // 2. Definimos los headers asegurando que el valor sea string
  const headers = { 
    'x-auth-token': token 
  };

  // 3. Pasamos los headers en el objeto de opciones
  return this.http.get(`${this.apiURL}/users`, { headers });
}
  // user.service.ts
createUser(userData: any) {
  const token = localStorage.getItem('token') || ''; // Evita que sea null
  const headers = { 'x-auth-token': token };
  return this.http.post(`${this.apiURL}/register`, userData, { headers });
}
}