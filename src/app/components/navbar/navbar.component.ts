import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
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
  menuOpen = false; // Para el menú móvil
  userMenuOpen = false; // 🆕 Para el menú desplegable del usuario

  @ViewChild('userMenuContainer') userMenuContainer?: ElementRef;

  constructor(
    private auth: AuthService,
    private cart: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargar usuario desde localStorage al iniciar
    this.auth.user$.subscribe((u) => {
      this.user = u;
    });

    // Escuchar contador del carrito
    this.cart.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });
  }

  // ============================
  // 🔄 Toggle menú móvil
  // ============================
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    // Cerrar menú de usuario si está abierto
    if (this.menuOpen) {
      this.userMenuOpen = false;
    }
  }

  // ============================
  // 👤 Toggle menú desplegable del usuario
  // ============================
  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  // ============================
  // ❌ Cerrar menú del usuario
  // ============================
  closeUserMenu() {
    this.userMenuOpen = false;
  }

  // ============================
  // 🖱️ Cerrar menú al hacer click fuera
  // ============================
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    // Si el menú de usuario está abierto y se hace click fuera
    if (this.userMenuOpen && this.userMenuContainer) {
      const clickedInside = this.userMenuContainer.nativeElement.contains(target);
      if (!clickedInside) {
        this.userMenuOpen = false;
      }
    }
  }

  // ============================
  // 🚪 Cerrar sesión
  // ============================
  logout() {
    this.closeUserMenu();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}