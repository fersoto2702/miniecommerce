// Archivo: product-card.component.ts

import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {

  @Input() product: any;

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  // 👉 Ir al detalle del producto
  openDetail() {
    // Cambiado de '/products' a '/product' para que coincida con la ruta definida
    this.router.navigate(['/product', this.product.id]); 
  }

  // 👉 Agregar al carrito
  addToCart(event?: Event) {
    event?.stopPropagation();
    
    // Se pasa el objeto 'product' completo (asumiendo que tiene la propiedad 'id')
    this.cartService.add(this.product, 1).subscribe({
      next: () => {
        alert('Producto agregado al carrito');
        
        // 🌟 LÍNEA CLAVE CORREGIDA 🌟
        // Esto notifica al servicio que recargue el contador y actualice el estado del carrito.
        this.cartService.loadCartCountFromAPI(); 
      },
      error: () => alert('Error al agregar al carrito')
    });
  }
}