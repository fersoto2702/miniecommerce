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
  loading = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.items = res.items || [];
        this.loading = false;
      },
      error: () => {
        this.items = [];
        this.loading = false;
      }
    });
  }

  removeItem(id: number) {
    this.cartService.remove(id).subscribe({
      next: () => this.loadCart(),
      error: () => alert('Error eliminando')
    });
  }

  clearCart() {
    this.cartService.clear().subscribe({
      next: () => this.loadCart(),
      error: () => alert('Error al vaciar')
    });
  }

  total() {
    return this.items.reduce(
      (sum: number, item: any) =>
        sum + item.quantity * item.Product.price,
      0
    );
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}