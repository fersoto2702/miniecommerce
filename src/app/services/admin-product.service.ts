import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {

  private apiURL = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // ============================================================
  // 🔹 Obtener todos los productos (GET /products)
  // ============================================================
  getAll(): Observable<any> {
    return this.http.get(this.apiURL);
  }

  // ============================================================
  // 🔹 Obtener producto por ID (GET /products/:id)
  // ============================================================
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`);
  }

  // ============================================================
  // 🔹 Crear producto (POST /products)
  // ============================================================
  create(product: any): Observable<any> {
    return this.http.post(this.apiURL, product);
  }

  // ============================================================
  // 🔹 Actualizar producto (PUT /products/:id)
  // ============================================================
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiURL}/${id}`, data);
  }

  // ============================================================
  // 🔹 Eliminar producto (DELETE /products/:id)
  // ============================================================
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
