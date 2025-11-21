import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {

  user: any = null;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.user = this.auth.getCurrentUser(); // Obtenemos usuario actual
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}