import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  featured:any[] = [];
  constructor(ps:ProductService){ this.featured = ps.getAll().slice(0,6); }
}