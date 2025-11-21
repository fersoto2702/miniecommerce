import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartIconComponent } from '../cart-icon/cart-icon.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, CartIconComponent, SearchBarComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user: any = null;

  constructor(private auth: AuthService, private router: Router) {
    // Obtener el usuario almacenado
    this.user = this.auth.getCurrentUser();

    // Escuchar cambios de login/logout
    this.auth.user$.subscribe((u) => (this.user = u));
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}