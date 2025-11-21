import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CartComponent implements OnInit {

  items: any[] = [];

  constructor(
    private cart: CartService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.items = this.cart.getCart();   // <-- SE CARGA DESDE AQUÍ
  }

  total() {
    return this.cart.total();
  }

  remove(id: number) {
    this.cart.remove(id);
    this.items = this.cart.getCart();   // <-- REFRESCA LISTA
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}