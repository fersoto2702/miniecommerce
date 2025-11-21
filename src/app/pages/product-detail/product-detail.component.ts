import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { QuantityModalComponent } from '../../components/quantity-modal/quantity-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, QuantityModalComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {

  product: any;
  showModal = false;

  constructor(
    private route: ActivatedRoute,
    private ps: ProductService,
    private cart: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.ps.getById(id);
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  addQty(qty: number) {
    this.cart.add(this.product, qty);
    alert('Producto añadido al carrito.');
    this.showModal = false;
    this.router.navigate(['/cart']);
  }
}