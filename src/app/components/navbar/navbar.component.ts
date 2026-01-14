import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { CartIconComponent } from '../cart-icon/cart-icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    CartIconComponent,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  user: any = null;
  cartCount: number = 0;
  menuOpen = false; // 🆕 Para el menú móvil

  constructor(
    private auth: AuthService,
    private cart: CartService,
    private router: Router
  ) {}

ngOnInit(): void {
  // 🔥 Cargar usuario realmente desde localStorage al iniciar
  this.auth.user$.subscribe((u) => {
    this.user = u;
  });

  this.cart.cartCount$.subscribe((count) => {
    this.cartCount = count;
  });

    // 🔹 Escuchar login/logout
    this.auth.user$.subscribe((u) => {
      this.user = u;
    });

    // 🔹 Escuchar contador del carrito
    this.cart.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });
  }

  // 🆕 Toggle menú móvil
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}