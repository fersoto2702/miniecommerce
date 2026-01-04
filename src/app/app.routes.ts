import { Routes } from '@angular/router';

// Páginas usuario
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/product/productos.component';
import { CartComponent } from './pages/carrito/carrito.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

// Admin
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './admin/products/admin-products/admin-products.component';
import { AdminEditProductComponent } from './admin/products/admin-edit-product/admin-edit-product.component';
import { AdminUsersComponent } from './admin/users/admin-users/admin-users.component';

export const routes: Routes = [

  // 🔹 AL ARRANCAR LA APP → LOGIN
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ===================
  // 🔓 RUTAS PÚBLICAS
  // ===================
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // ===================
  // 🔐 RUTAS PROTEGIDAS (USUARIO)
  // ===================
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'product/:id', component: ProductDetailComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },

  // ===================
  // 🔐 RUTAS ADMIN
  // ===================
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'products/edit/:id', component: AdminEditProductComponent },
      { path: 'users', component: AdminUsersComponent }
    ]
  },

  // ===================
  // 🚫 RUTA 404 (NUNCA LOGIN)
  // ===================
  { path: '**', redirectTo: 'home' }
];