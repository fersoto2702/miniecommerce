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
    return this.http.get(`${this.apiURL}/users`);
  }

  // user.service.ts
createUser(userData: { name: string; email: string; password: string; role: string }) {
  return this.http.post(`${this.apiURL}/auth/register`, userData);
}
}