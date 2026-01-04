import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { QuantityModalComponent } from '../../components/quantity-modal/quantity-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, QuantityModalComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {

  product: any = null;
  loading = true;
  showModal = false;

  constructor(
    private route: ActivatedRoute,
    private ps: ProductService,
    private cart: CartService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.ps.getById(id).subscribe({
      next: (res: any) => {
        this.product = res.product || res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('¡Producto no encontrado en la Pokédex! 🔥');
        this.router.navigate(['/products']);
      }
    });
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // ============================================================
  // 🔹 Agregar producto al carrito (CON NOTIFICACIONES POKÉMON)
  // ============================================================
  addQty(qty: number) {

  // 🔊 SONIDO POKÉMON (ligado directamente al click)
  this.notificationService.success(
    `¡Gotcha! ${this.product.name} capturado ⚡`,
    2000
  );

  // 🔄 Ahora sí la llamada async
  this.cart.add(this.product, qty).subscribe({
    next: () => {

      // 🔥 Actualiza contador del navbar
      this.cart.loadCartCountFromAPI();

      this.showModal = false;

      // ⏳ Pequeño delay para que se perciba la notificación
      setTimeout(() => {
        this.router.navigate(['/cart']);
      }, 800);
    },
    error: () => {
      this.notificationService.error('¡Oh no! Error al capturar el producto 🔥');
    }
  });
}
}