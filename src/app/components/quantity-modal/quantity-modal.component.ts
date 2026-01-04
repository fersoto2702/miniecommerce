import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-quantity-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quantity-modal.component.html',
  styleUrls: ['./quantity-modal.component.css']
})
export class QuantityModalComponent {

  @Input() product: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<number>();

  qty = 1;
  showLimitMessage = false;
  isLoading = false;
  showSuccess = false;

  constructor(private notificationService: NotificationService) {}

  // Cerrar con tecla ESC
 @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }

  add() {
    if (this.qty < this.product.stock) {
      this.qty++;
    } else {
      this.triggerLimitMessage();
    }
  }

  remove() {
    if (this.qty > 1) {
      this.qty--;
    }
  }

  // Validar cantidad del input
  validateQty() {
    const value = Number(this.qty);
    
    if (isNaN(value) || value < 1) {
      this.qty = 1;
    } else if (value > this.product.stock) {
      this.qty = this.product.stock;
      this.triggerLimitMessage();
    } else {
      this.qty = Math.floor(value);
    }
  }

  // Mostrar mensaje de límite de stock
  triggerLimitMessage() {
    this.showLimitMessage = true;
    setTimeout(() => {
      this.showLimitMessage = false;
    }, 2000);
  }

  // Cerrar al hacer click en el backdrop
  closeOnBackdrop(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('backdrop-blur-sm')) {
      this.onClose();
    }
  }

  accept() {
    if (this.isLoading) return;
    
    const finalQty = Number(this.qty);

    if (finalQty > 0 && finalQty <= this.product.stock) {
      this.isLoading = true;

      // Simular loading (animación de captura)
      setTimeout(() => {
        // 🔊 SONIDO + Notificación
        this.notificationService.success('¡Pika! ⚡');
        
        // Mostrar mensaje de éxito
        this.showSuccess = true;

        // Emitir cantidad
        this.confirm.emit(finalQty);

        // Cerrar modal después de mostrar el éxito
        setTimeout(() => {
          this.onClose();
          this.isLoading = false;
        }, 500);

        // Ocultar mensaje de éxito
        setTimeout(() => {
          this.showSuccess = false;
        }, 3000);
      }, 1000);
    }
  }

  onClose() {
    this.close.emit();
    // Reset del estado
    this.qty = 1;
    this.showLimitMessage = false;
    this.isLoading = false;
  }
}