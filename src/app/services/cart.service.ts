import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private storageKey = 'cart_items';
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable(); // <-- LO QUE EL NAVBAR VA A ESCUCHAR

  constructor() {
    this.updateCounter(); // inicializa el contador al abrir la app
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private updateCounter() {
    if (!this.isBrowser()) return;
    const cart = this.getCart();
    const count = cart.reduce((sum: number, item: any) => sum + item.qty, 0);
    this.cartCountSubject.next(count);
  }

  getCart() {
    if (!this.isBrowser()) return [];
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  add(product: any, qty: number = 1) {
    if (!this.isBrowser()) return;

    const cart = this.getCart();
    const existing = cart.find((item: any) => item.product.id === product.id);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ product, qty });
    }

    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.updateCounter(); // <-- MUY IMPORTANTE
  }

  remove(productId: number) {
    if (!this.isBrowser()) return;
    const filtered = this.getCart().filter((item: any) => item.product.id !== productId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    this.updateCounter(); // <-- MUY IMPORTANTE
  }

  clear() {
    if (!this.isBrowser()) return;
    localStorage.removeItem(this.storageKey);
    this.updateCounter(); // <-- MUY IMPORTANTE
  }

  total() {
    if (!this.isBrowser()) return 0;
    return this.getCart().reduce(
      (sum: number, item: any) => sum + (item.product.price * item.qty),
      0
    );
  }
}