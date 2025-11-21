import { Component } from '@angular/core';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent {
  users = [
    { id: 1, name: 'Kenny', email: 'user@mail.com', role: 'user' },
    { id: 2, name: 'Admin', email: 'admin@mail.com', role: 'admin' }
  ];
}