import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {

  private products = [
    { id: 1, name: 'iPhone 13', price: 17000, desc: 'Muy bueno', image: 'assets/iphone.jpg' },
    { id: 2, name: 'Samsung S22', price: 15000, desc: 'Android potente', image: 'assets/s22.jpg' }
  ];

  getAll() {
    return this.products;
  }

  getById(id: number) {
    return this.products.find(p => p.id === id);
  }

  update(id: number, data: any) {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) this.products[index] = { ...this.products[index], ...data };
  }

  delete(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }
}