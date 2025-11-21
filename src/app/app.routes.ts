import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/product/productos.component';
import { CartComponent } from './pages/carrito/carrito.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

// =====================
// IMPORTACIONES ADMIN
// =====================
import { AdminGuard } from './guards/admin.guard';

import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './admin/products/admin-products/admin-products.component';
import { AdminEditProductComponent } from './admin/products/admin-edit-product/admin-edit-product.component';
import { AdminUsersComponent } from './admin/users/admin-users/admin-users.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

export const routes: Routes = [

  // ===================
  // RUTAS DEL USUARIO
  // ===================
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'checkout', component: CheckoutComponent },

  // ===================
  // RUTAS DEL ADMIN
  // ===================
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'products/edit/:id', component: AdminEditProductComponent },
      { path: 'users', component: AdminUsersComponent },
    ]
  },

  // ===================
  // RUTA POR DEFECTO
  // ===================
  { path: '**', redirectTo: '' }
];