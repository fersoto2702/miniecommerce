import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  name=''; card=''; cvv=''; exp='';
  total=0;
  constructor(private cart:CartService, private router:Router){ this.total = this.cart.total(); }
  pay(){
    if(this.card.replace(/\s/g,'').length < 16 || this.cvv.length < 3){ alert('Datos inválidos'); return; }
    alert('Pago simulado OK — pedido creado');
    this.cart.clear();
    this.router.navigate(['/']);
  }
}