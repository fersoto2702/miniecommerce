import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  hideLayout = false; // <-- Ocultar NAVBAR/FOOTER
  isAdminRoute = false; // <-- NUEVA LÍNEA: Detectar rutas admin

  constructor(private router: Router) {
    // Detecta navegación para saber si debemos ocultar el layout
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {

        const url = event.urlAfterRedirects ?? event.url;

        // Ocultar layout en estas rutas
        this.hideLayout =
          url.includes('/login') || 
          url.includes('/register');

        // Detectar si es ruta admin - NUEVAS LÍNEAS
        this.isAdminRoute = url.includes('/admin');
      });
  }
}