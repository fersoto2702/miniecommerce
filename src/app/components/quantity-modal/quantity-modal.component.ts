import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantity-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quantity-modal.component.html',
  styleUrls: ['./quantity-modal.component.css']
})
export class QuantityModalComponent {

  @Input() product: any = null;       // Producto recibido
  @Output() close = new EventEmitter();  
  @Output() confirm = new EventEmitter<number>(); 

  qty = 1;

  add() { this.qty++; }
  remove() { if (this.qty > 1) this.qty--; }

  accept() {
    this.confirm.emit(this.qty);
  }
}