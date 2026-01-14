import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiURL = `${environment.apiUrl}/cart`;
  private orderURL = `${environment.apiUrl}/orders`;

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    // ❌ NO cargar carrito aquí
  }

  // ============================================================
  // 🔹 Obtener carrito desde backend
  // ============================================================
  getCart() {
    return this.http.get<any>(this.apiURL);
  }

  // ============================================================
  // 🔹 Agregar producto al carrito
  // ============================================================
  add(product: any, qty: number = 1) {
    return this.http.post(`${this.apiURL}/add`, {
      productId: product.id,
      quantity: qty
    }).pipe(
      tap(() => this.loadCartCountFromAPI())
    );
  }

  // ============================================================
  // 🔹 Eliminar item
  // ============================================================
  remove(cartItemId: number) {
    return this.http.delete(`${this.apiURL}/${cartItemId}`)
      .pipe(tap(() => this.loadCartCountFromAPI()));
  }

  // ============================================================
  // 🔹 Vaciar carrito
  // ============================================================
  clear() {
    return this.http.delete(this.apiURL)
      .pipe(tap(() => this.loadCartCountFromAPI()));
  }

  // ============================================================
  // 🔹 Cargar contador SOLO si hay token
  // ============================================================
  loadCartCountFromAPI() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.cartCountSubject.next(0);
      return;
    }

    this.getCart().subscribe({
      next: (res: any) => {
        const count = res.items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        this.cartCountSubject.next(count);
      },
      error: () => {
        this.cartCountSubject.next(0);
      }
    });
  }

  // ============================================================
  // 🔹 Crear orden
  // ============================================================
  createOrderFromCart() {
    return this.http.post(`${this.orderURL}/from-cart`, {});
  }

  // ============================================================
  // 🔹 Procesar pago
  // ============================================================
  processPayment(orderId: number, paymentMethod: string) {
    return this.http.post(`${this.orderURL}/process-payment`, {
      orderId,
      paymentMethod
    });
  }
}
