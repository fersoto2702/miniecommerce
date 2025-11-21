/* login.component.ts */
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    const r = this.auth.login(this.email, this.password);

    if (!r.ok || !r.user) {
      alert(r.message);
      return;
    }

    alert('Login exitoso');

    // ADMIN → dashboard
    if (r.user.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    // USUARIO → Home
    this.router.navigate(['/home']);
  }
}