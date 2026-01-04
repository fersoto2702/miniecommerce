import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-quantity-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quantity-modal.component.html',
  styleUrls: ['./quantity-modal.component.css']
})
export class QuantityModalComponent {

  @Input() product: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<number>();

  qty = 1;

  constructor(private notificationService: NotificationService) {}

  add() { this.qty++; }

  remove() {
    if (this.qty > 1) this.qty--;
  }

  accept() {
    const finalQty = Number(this.qty);

    if (finalQty > 0) {
      // 🔊 SONIDO AQUÍ (click real del usuario)
      this.notificationService.success('¡Pika! ⚡');

      // Emitimos cantidad
      this.confirm.emit(finalQty);
    }
  }

  onClose() {
    this.close.emit();
  }
}