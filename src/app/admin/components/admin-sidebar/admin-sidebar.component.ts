import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.component.html'
})
export class AdminSidebarComponent implements OnInit {

  user: any = null;
  loading = true;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(u => {
      this.user = u;
      this.loading = false;
      console.log('ADMIN USER:', this.user);
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}