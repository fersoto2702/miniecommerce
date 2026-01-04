import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-icon.component.html',
  styleUrls: ['./cart-icon.component.css']
})
export class CartIconComponent {

  count = 0;

  constructor(private cart: CartService) {

    // 🔥 Esto escuchará actualizaciones del backend
    this.cart.cartCount$.subscribe(c => {
      this.count = c;
    });

    // 🔥 Cargar el contador inicial desde API
    this.cart.loadCartCountFromAPI();
  }
}