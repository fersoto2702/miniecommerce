import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiURL = `${environment.apiUrl}/auth`;

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // ============================================================
  // Cargar usuario guardado al iniciar la app
  // ============================================================
  private loadUserFromStorage() {
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      this.userSubject.next(JSON.parse(userRaw));
    }
  }

  // ============================================================
  // LOGIN (POST /auth/login)
  // ============================================================
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiURL}/login`, { email, password }).pipe(
      tap((res: any) => {
        if (res.ok && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.userSubject.next(res.user);
        }
      })
    );
  }

  // ============================================================
  // REGISTRO (POST /auth/register)
  // ============================================================
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiURL}/register`, { name, email, password }).pipe(
      tap((res: any) => {
        if (res.ok && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.userSubject.next(res.user);
        }
      })
    );
  }

  // ============================================================
  // RESET PASSWORD (POST /auth/reset-password)
  // ============================================================
  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiURL}/reset-password`, {
      email,
      newPassword
    });
  }

  // ============================================================
  // PERFIL (GET /auth/me)
  // ============================================================
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiURL}/me`).pipe(
      tap((res: any) => {
        if (res && res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.userSubject.next(res.user);
        }
      })
    );
  }

  // ============================================================
  // LOGOUT
  // ============================================================
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  // ============================================================
  // Obtener usuario actual desde Angular
  // ============================================================
  getCurrentUser() {
    return this.userSubject.value;
  }
}
