import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

declare var paypal: any;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  Product?: {
    name: string;
    price: number;
    image_url?: string;
  };
}

interface Country {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  // ============================
  // Datos del formulario
  // ============================
  name = '';
  card = '';
  cvv = '';
  exp = '';
  saveCard = false;

  // Dirección
  address = {
    street: '',
    city: '',
    country: '',
    zip: ''
  };

  // ============================
  // Validación y errores
  // ============================
  nameError = '';
  nameTouched = false;
  cardError = '';
  cardTouched = false;
  expError = '';
  expTouched = false;
  cvvError = '';
  cvvTouched = false;

  // Tipo de tarjeta detectado
  cardType: string = '';

  // ============================
  // Preview de tarjeta 3D
  // ============================
  cardFlipped = false;

  // ============================
  // Estados del proceso
  // ============================
  loading = false;
  isProcessing = false;
  paymentSuccess = false;

  // ============================
  // Carrito y totales
  // ============================
  cartItems: CartItem[] = [];
  subtotal = 0;
  shipping = 15;
  taxes = 0;
  discount = 0;
  total = 0;

  // ============================
  // Cupones
  // ============================
  couponCode = '';
  couponApplied = false;
  validCoupons = ['POKEMON10', 'PIKACHU20', 'STARTER5'];

  // ============================
  // Resumen expandible
  // ============================
  orderExpanded = true;

  // ============================
  // Progress stepper
  // ============================
  currentStep = 2; // 0: Carrito, 1: Envío, 2: Pago, 3: Confirmación
  steps = [
    { icon: '🛒', label: 'Carrito' },
    { icon: '📦', label: 'Envío' },
    { icon: '💳', label: 'Pago' },
    { icon: '✓', label: 'Confirmación' }
  ];

  // ============================
  // Animaciones
  // ============================
  showConfetti = false;
  confettiPieces: any[] = [];
  stars: any[] = [];

  // ============================
  // Social proof
  // ============================
  liveViewers = 0;
  todayPurchases = 0;
  private viewersInterval: any;

  // ============================
  // Gamificación
  // ============================
  userLevel = 5;
  userTitle = 'Entrenador Pokémon';
  userXP = 750;
  nextLevelXP = 1000;
  xpReward = 50;

  // ============================
  // Países
  // ============================
  countries: Country[] = [
    { code: 'MX', name: 'México', flag: '🇲🇽' },
    { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
    { code: 'ES', name: 'España', flag: '🇪🇸' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱' },
    { code: 'PE', name: 'Perú', flag: '🇵🇪' }
  ];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
    this.initStars();
    this.startLiveViewers();
    
    setTimeout(() => {
      this.initPayPal();
    }, 500);
  }

  ngOnDestroy() {
    if (this.viewersInterval) {
      clearInterval(this.viewersInterval);
    }
  }

  // ============================
  // 🛒 Cargar carrito
  // ============================
  loadCart() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        this.cartItems = (res.items || []).map((item: any) => ({
          id: item.id,
          name: item.Product?.name || 'Producto',
          price: item.Product?.price || 0,
          quantity: item.quantity || 1,
          image: item.Product?.image_url || 'https://via.placeholder.com/150'
        }));
        
        this.calculateTotals();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // ============================
  // 💰 Calcular totales
  // ============================
  calculateTotals() {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );
    this.taxes = Math.round(this.subtotal * 0.16 * 100) / 100;
    this.total = this.subtotal + this.shipping + this.taxes - this.discount;
    this.total = Math.round(this.total * 100) / 100;
  }

  // ============================
  // 🎫 Aplicar cupón
  // ============================
  applyCoupon() {
    const code = this.couponCode.toUpperCase();
    
    if (!this.validCoupons.includes(code)) {
      alert('❌ Cupón inválido');
      return;
    }

    if (this.couponApplied) {
      alert('⚠️ Ya tienes un cupón aplicado');
      return;
    }

    // Calcular descuento según el cupón
    if (code === 'POKEMON10') {
      this.discount = Math.round(this.subtotal * 0.10 * 100) / 100;
    } else if (code === 'PIKACHU20') {
      this.discount = Math.round(this.subtotal * 0.20 * 100) / 100;
    } else if (code === 'STARTER5') {
      this.discount = Math.round(this.subtotal * 0.05 * 100) / 100;
    }

    this.couponApplied = true;
    this.calculateTotals();
    alert('✅ Cupón aplicado: -$' + this.discount);
  }

  // ============================
  // 📋 Toggle resumen
  // ============================
  toggleOrderSummary() {
    this.orderExpanded = !this.orderExpanded;
  }

  // ============================
  // 💳 Validación de nombre
  // ============================
  validateName() {
    this.nameTouched = true;
    
    if (!this.name.trim()) {
      this.nameError = 'El nombre es requerido';
    } else if (this.name.trim().length < 3) {
      this.nameError = 'Nombre demasiado corto';
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(this.name)) {
      this.nameError = 'Solo letras y espacios';
    } else {
      this.nameError = '';
    }
  }

  // ============================
  // 💳 Input de tarjeta con formato
  // ============================
  onCardInput(event: any) {
    this.cardTouched = true;
    
    // Remover espacios y no-dígitos
    let value = this.card.replace(/\D/g, '');
    
    // Limitar a 16 dígitos
    value = value.substring(0, 16);
    
    // Agregar espacios cada 4 dígitos
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    this.card = formatted;
    
    // Detectar tipo de tarjeta
    this.detectCardType(value);
    
    // Validar con algoritmo de Luhn
    this.validateCard();
  }

  // ============================
  // 🔍 Detectar tipo de tarjeta
  // ============================
  detectCardType(cardNumber: string) {
    const firstDigit = cardNumber[0];
    const firstTwo = cardNumber.substring(0, 2);
    
    if (firstDigit === '4') {
      this.cardType = 'Visa';
    } else if (['51', '52', '53', '54', '55'].includes(firstTwo)) {
      this.cardType = 'Mastercard';
    } else if (['34', '37'].includes(firstTwo)) {
      this.cardType = 'American Express';
    } else if (cardNumber.length > 0) {
      this.cardType = 'Desconocida';
    } else {
      this.cardType = '';
    }
  }

  // ============================
  // ✅ Validación de Luhn
  // ============================
  validateCard() {
    const cardNumber = this.card.replace(/\s/g, '');
    
    if (cardNumber.length === 0) {
      this.cardError = '';
      return;
    }
    
    if (cardNumber.length < 13) {
      this.cardError = 'Número de tarjeta incompleto';
      return;
    }
    
    if (cardNumber.length > 19) {
      this.cardError = 'Número de tarjeta demasiado largo';
      return;
    }
    
    // Algoritmo de Luhn
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    if (sum % 10 === 0) {
      this.cardError = '';
    } else {
      this.cardError = 'Número de tarjeta inválido';
    }
  }

  // ============================
  // 📅 Input de fecha con formato
  // ============================
  onExpInput(event: any) {
    this.expTouched = true;
    
    let value = this.exp.replace(/\D/g, '');
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    this.exp = value.substring(0, 5);
    this.validateExp();
  }

  // ============================
  // ✅ Validación de fecha
  // ============================
  validateExp() {
    if (this.exp.length === 0) {
      this.expError = '';
      return;
    }
    
    if (this.exp.length < 5) {
      this.expError = 'Formato: MM/AA';
      return;
    }
    
    const [month, year] = this.exp.split('/').map(Number);
    
    if (month < 1 || month > 12) {
      this.expError = 'Mes inválido (01-12)';
      return;
    }
    
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      this.expError = 'Tarjeta vencida';
      return;
    }
    
    this.expError = '';
  }

  // ============================
  // 🔒 Input de CVV
  // ============================
  onCvvInput(event: any) {
    this.cvvTouched = true;
    this.cvv = this.cvv.replace(/\D/g, '').substring(0, 4);
    this.validateCvv();
  }

  // ============================
  // ✅ Validación de CVV
  // ============================
  validateCvv() {
    if (this.cvv.length === 0) {
      this.cvvError = '';
    } else if (this.cvv.length < 3) {
      this.cvvError = '3-4 dígitos requeridos';
    } else {
      this.cvvError = '';
    }
  }

  // ============================
  // 🎨 Gradiente de tarjeta según tipo
  // ============================
  getCardGradient(): string {
    switch (this.cardType) {
      case 'Visa':
        return 'bg-gradient-to-br from-blue-600 to-blue-800';
      case 'Mastercard':
        return 'bg-gradient-to-br from-red-600 to-orange-600';
      case 'American Express':
        return 'bg-gradient-to-br from-green-600 to-teal-600';
      default:
        return 'bg-gradient-to-br from-gray-700 to-gray-900';
    }
  }

  // ============================
  // 🎴 Icono de tarjeta según tipo
  // ============================
  getCardIcon(): string {
    switch (this.cardType) {
      case 'Visa':
        return '💳';
      case 'Mastercard':
        return '💳';
      case 'American Express':
        return '💳';
      default:
        return '💳';
    }
  }

  // ============================
  // 🔢 Formatear número de tarjeta para preview
  // ============================
  formatCardNumber(cardNumber: string): string {
    if (!cardNumber) return '';
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  }

  // ============================
  // ✅ Validar formulario completo
  // ============================
  isFormValid(): boolean {
    return (
      this.name.trim().length >= 3 &&
      !this.nameError &&
      this.card.replace(/\s/g, '').length >= 13 &&
      !this.cardError &&
      this.exp.length === 5 &&
      !this.expError &&
      this.cvv.length >= 3 &&
      !this.cvvError
    );
  }

  // ============================
  // 💰 Procesar pago
  // ============================
  async pay() {
    if (!this.isFormValid()) {
      alert('⚠️ Por favor completa todos los campos correctamente');
      return;
    }

    this.isProcessing = true;

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    this.cartService.createOrderFromCart().subscribe({
      next: () => {
        this.isProcessing = false;
        this.paymentSuccess = true;
        
        // Mostrar confetti
        this.triggerConfetti();
        
        // Limpiar carrito
        this.cartService.clear().subscribe();
        
        // Avanzar al siguiente paso
        this.currentStep = 3;
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 3000);
      },
      error: () => {
        this.isProcessing = false;
        alert('❌ Error al procesar el pago. Intenta nuevamente.');
      }
    });
  }

  // ============================
  // 🎉 Activar confetti
  // ============================
  triggerConfetti() {
    this.showConfetti = true;
    this.confettiPieces = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      color: this.getRandomColor(),
      delay: Math.random() * 0.5
    }));

    setTimeout(() => {
      this.showConfetti = false;
    }, 4000);
  }

  getRandomColor(): string {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // ============================
  // ⭐ Inicializar estrellas flotantes
  // ============================
  initStars() {
    this.stars = Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 12 + Math.random() * 12,
      delay: Math.random() * 3,
      icon: Math.random() > 0.5 ? '✨' : '⭐'
    }));
  }

  // ============================
  // 👥 Iniciar contador de viewers
  // ============================
  startLiveViewers() {
    this.liveViewers = 12 + Math.floor(Math.random() * 8);
    this.todayPurchases = 1234 + Math.floor(Math.random() * 100);

    this.viewersInterval = setInterval(() => {
      this.liveViewers = 12 + Math.floor(Math.random() * 8);
    }, 5000);
  }

  // ============================
  // 🟡 PayPal
  // ============================
  initPayPal() {
    if (!paypal) return;

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.total.toFixed(2)
            }
          }]
        });
      },

      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then(() => {
          this.paymentSuccess = true;
          this.triggerConfetti();
          
          this.cartService.createOrderFromCart().subscribe(() => {
            this.cartService.clear().subscribe();
            
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 2000);
          });
        });
      },

      onError: (err: any) => {
        console.error('PAYPAL ERROR:', err);
        alert('❌ Error en PayPal');
      }

    }).render('#paypal-button-container');
  }
}