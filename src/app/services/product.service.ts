/* Product.service.ts */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products = [
    { 
      id: 1, 
      name: 'iPhone 15 Pro', 
      price: 27999, 
      stock: 10, 
      image: 'https://www.macstoreonline.com.mx/img/sku/IPHONE632_Z1.webp', 
      category: 'Apple',
      

      details: {
        pantalla: '6.1" Super Retina XDR',
        bateria: '3,650 mAh',
        camara: '48MP principal',
        almacenamiento: '256GB',
        procesador: 'Apple A17 Pro'
      }
    },
    { 
      id: 2, 
      name: 'Samsung Galaxy S24', 
      price: 23999, 
      stock: 8, 
      image: 'https://i5.walmartimages.com/asr/f69b0b7c-e51a-4ff2-a427-3da192bc74d6.eeafa7e33b92ad3ec92e3fe1a22d8e4f.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF', 
      category: 'Samsung',

      details: {
        pantalla: '6.7" AMOLED 120Hz',
        bateria: '4,900 mAh',
        camara: '200MP + 50MP + 12MP',
        almacenamiento: '256GB',
        procesador: 'Snapdragon 8 Gen 3'
      }
    },
    { 
      id: 3, 
      name: 'Xiaomi 14 Ultra', 
      price: 19999, 
      stock: 20, 
      image: 'https://th.bing.com/th/id/OIP.D2AD1t80PP3WaLIVRr8lcAHaHa?w=199&h=199&c=7&r=0&o=7&pid=1.7&rm=3', 
      category: 'Xiaomi',

      details: {
        pantalla: '6.8" AMOLED LTPO',
        bateria: '5,000 mAh',
        camara: '200MP Leica',
        almacenamiento: '512GB',
        procesador: 'Snapdragon 8 Gen 3'
      }
    },
    {
      id: 4,
      name: 'Iphone 14 Pro Max',
      price: 23999,
      stock: 12,
      image: 'https://www.macstoreonline.com.mx/img/sku/IPHONE569_Z1.webp',
      category: 'Apple',

      details: {
        pantalla: '6.7" Super Retina XDR',
        bateria: '4,323 mAh',
        camara: 'Triple cámara trasera con 48MP principal, 12MP ultrawide y 12MP telefoto',
        almacenamiento: '512GB',
        procesador: 'Apple A16 Bionic'
      }

    },
    {
    id: 5,
    name: 'Samsung Galaxy Z Fold 5',
    price: 34999,
    stock: 5,
    image: 'https://m.media-amazon.com/images/I/51aJ3gvbNrL._AC_SY450_.jpg',
    category: 'Samsung',

    details: {
      pantalla: '6.7" AMOLED plegable',
      bateria: '4,900 mAh',
      camara: '200MP principal',
      almacenamiento: '256GB',
      procesador: 'Snapdragon 8 Gen 3'
    }
  },
  {
    id: 6,
    name: 'Xiaomi Redmi Note 13 Pro',
    price: 7999,
    stock: 30,
    image: 'https://m.media-amazon.com/images/I/51qT8RuY56L._AC_SY300_SX300_QL70_ML2_.jpg',
    category: 'Xiaomi'
  }
  ];

  constructor() {}

  getAll() {
    return [...this.products];
  }

  getById(id: number) {
    return this.products.find(p => p.id === id);
  }

  create(product: any) {
    product.id = Date.now();
    this.products.push(product);
  }

  update(id: number, data: any) {
    const index = this.products.findIndex(p => p.id === id);
    if (index >= 0) {
      this.products[index] = { ...this.products[index], ...data };
    }
  }

  delete(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }
}