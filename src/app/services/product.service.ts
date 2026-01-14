import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiURL = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // ============================================================
  // 🔹 OBTENER TODOS LOS PRODUCTOS
  // Backend responde: { ok: true, products: [...] }
  // ============================================================
  getAll(term: string = ''): Observable<any[]> {
    return this.http
      .get<any>(`${this.apiURL}?q=${term}`)
      .pipe(map(res => res.products || []));
  }

  // ============================================================
  // 🔹 OBTENER PRODUCTO POR ID
  // Backend responde: { ok: true, product: {...} }
  // ============================================================
  getById(id: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiURL}/${id}`)
      .pipe(map(res => res.product || null));
  }

  // ============================================================
  // 🔹 CREAR PRODUCTO (ADMIN)
  // ============================================================
  create(product: any): Observable<any> {
    return this.http.post<any>(this.apiURL, product);
  }

  // ============================================================
  // 🔹 ACTUALIZAR PRODUCTO
  // ============================================================
  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/${id}`, data);
  }

  // ============================================================
  // 🔹 ELIMINAR PRODUCTO
  // ============================================================
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${id}`);
  }
}
