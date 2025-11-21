import { Component, OnInit } from '@angular/core';
import { AdminProductService } from '../../../services/admin-product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './admin-edit-product.component.html'
})
export class AdminEditProductComponent implements OnInit {

  product:any;

  constructor(
    private route: ActivatedRoute,
    private adminPs: AdminProductService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.adminPs.getById(id);
  }

  save() {
    this.adminPs.update(this.product.id, this.product);
    alert('Producto actualizado');
    this.router.navigate(['/admin/products']);
  }
}