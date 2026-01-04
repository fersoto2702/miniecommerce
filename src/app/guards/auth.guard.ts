import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    // 🚫 PERMITIR SIEMPRE ASSETS (CRÍTICO)
    if (state.url.startsWith('/assets')) {
      return true;
    }

    const token = localStorage.getItem('token');

    // ❌ No hay token → no puede pasar
    if (!token) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si hay usuario cargado en memoria
    const user = this.auth.getCurrentUser();

    if (!user) {
      this.auth.getProfile().subscribe({
        next: () => {},
        error: () => {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
      });
    }

    return true;
  }
}