import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {

    const token = localStorage.getItem('token');

    // ❌ Sin token → fuera
    if (!token) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return of(false);
    }

    const user = this.auth.getCurrentUser();

    // ✅ Usuario ya cargado
    if (user) {
      if (user.role === 'admin') {
        return of(true);
      } else {
        this.router.navigate(['/home']);
        return of(false);
      }
    }

    // 🔄 Usuario NO cargado → pedirlo al backend
    return this.auth.getProfile().pipe(
      map((res: any) => {
        if (res.user?.role === 'admin') {
          return true;
        }

        this.router.navigate(['/home']);
        return false;
      }),
      catchError(() => {
        this.auth.logout();
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}