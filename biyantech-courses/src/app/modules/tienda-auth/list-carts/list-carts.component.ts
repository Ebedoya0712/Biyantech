import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../tienda-guest/service/cart.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

declare function alertSuccess([]):any;
declare function alertDanger([]):any;
declare var paypal:any;
declare var bootstrap: any;

@Component({
  selector: 'app-list-carts',
  templateUrl: './list-carts.component.html',
  styleUrls: ['./list-carts.component.css']
})
export class ListCartsComponent implements OnInit{

  listCarts:any = [];
  totalSum:number = 0;
  totalSumBs: number = 0; // Nuevo: Total en Bolívares
  code:any = null;
  
  // Tasas de cambio
  exchangeRate: any = null;
  usdToBsRate: number = 0;
  lastUpdate: string = '';
  
  // Estados de carga
  isPagoMovilLoading = false;
  isBinanceLoading = false;
  isProcessingPaypal = false;
  isLoadingRates = false;
  
  // Variables para el modal de Pago Móvil
  currentStep: number = 1;
  selectedFile: File | null = null;
  filePreview: string | null = null;
  isFileOver: boolean = false;
  isVerificationComplete: boolean = false;
  verificationProgress: number = 0;
  verificationInterval: any;
  
  @ViewChild('paypal',{static: true}) paypalElement?: ElementRef;
  @ViewChild('pagoMovilModal') pagoMovilModal!: ElementRef;
  
  // Logos como base64
  pagoMovilLogo = `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 1H7C5.9 1 5 1.9 5 3V21C5 22.1 5.9 23 7 23H17C18.1 23 19 22.1 19 21V3C19 1.9 18.1 1 17 1ZM17 19H7V5H17V19Z" fill="currentColor"/>
      <path d="M12 21C12.5523 21 13 20.5523 13 20C13 19.4477 12.5523 19 12 19C11.4477 19 11 19.4477 11 20C11 20.5523 11.4477 21 12 21Z" fill="currentColor"/>
    </svg>
  `)}`;

  binanceLogo = `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 5.09L12 8.18L8.91 5.09L12 2Z" fill="#F0B90B"/>
      <path d="M16.91 6.91L19.91 9.91L16.91 12.91L13.91 9.91L16.91 6.91Z" fill="#F0B90B"/>
      <path d="M7.09 6.91L10.09 9.91L7.09 12.91L4.09 9.91L7.09 6.91Z" fill="#F0B90B"/>
      <path d="M12 10.91L15.09 13.91L12 16.91L8.91 13.91L12 10.91Z" fill="#F0B90B"/>
      <path d="M16.91 14.91L19.91 17.91L16.91 20.91L13.91 17.91L16.91 14.91Z" fill="#F0B90B"/>
      <path d="M7.09 14.91L10.09 17.91L7.09 20.91L4.09 17.91L7.09 14.91Z" fill="#F0B90B"/>
    </svg>
  `)}`;

  constructor(
    public cartService: CartService,
    private router: Router,
    private http: HttpClient
  ) {}
  
  ngOnInit(): void {
    this.cartService.currentData$.subscribe((resp:any) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalSum = Array.isArray(this.listCarts) ? this.listCarts.reduce((sum:number, item:any) => sum + item.total,0) : 0;
      
      // Cuando se actualiza el carrito, calcular también en Bs
      if (this.totalSum > 0) {
        this.calculateBsAmount();
      }
    })

    this.initializePaypal();
    this.loadOfficialExchangeRate(); // Cargar tasa oficial al iniciar
  }

  // Cargar tasa de cambio oficial específica
  loadOfficialExchangeRate() {
    this.isLoadingRates = true;
    
    this.http.get('https://ve.dolarapi.com/v1/dolares/oficial').subscribe({
      next: (rate: any) => {
        this.exchangeRate = rate;
        
        // Determinar la mejor tasa disponible
        this.usdToBsRate = this.determineBestRate(rate);
        this.lastUpdate = this.formatUpdateDate(rate.fechaActualizacion);
        
        console.log('Tasa oficial cargada:', this.exchangeRate);
        console.log('Tasa USD a Bs seleccionada:', this.usdToBsRate);
        
        // Recalcular montos en Bs si hay total
        if (this.totalSum > 0) {
          this.calculateBsAmount();
        }
        
        this.isLoadingRates = false;
      },
      error: (error) => {
        console.error('Error cargando tasa oficial:', error);
        alertDanger('Error al cargar la tasa de cambio oficial');
        this.isLoadingRates = false;
        
        // Usar tasa por defecto en caso de error
        this.usdToBsRate = 35; // Tasa aproximada de respaldo
        this.lastUpdate = 'No disponible';
        if (this.totalSum > 0) {
          this.calculateBsAmount();
        }
      }
    });
  }

  // Determinar la mejor tasa disponible del objeto oficial
  determineBestRate(rate: any): number {
    // Priorizar venta, luego promedio, luego compra
    if (rate.venta && rate.venta > 0) {
      return rate.venta;
    } else if (rate.promedio && rate.promedio > 0) {
      return rate.promedio;
    } else if (rate.compra && rate.compra > 0) {
      return rate.compra;
    } else {
      return 35; // Tasa por defecto
    }
  }

  // Formatear fecha de actualización
  formatUpdateDate(dateString: string): string {
    if (!dateString) return 'No disponible';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  }

  // Calcular monto en Bolívares
  calculateBsAmount() {
    if (this.usdToBsRate > 0 && this.totalSum > 0) {
      this.totalSumBs = this.totalSum * this.usdToBsRate;
      // Redondear a 2 decimales
      this.totalSumBs = Math.round(this.totalSumBs * 100) / 100;
    } else {
      this.totalSumBs = 0;
    }
  }

  // Formatear número con separadores de miles
  formatNumber(number: number): string {
    return number.toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Obtener el nombre de la fuente de la tasa
  getRateSource(): string {
    if (!this.exchangeRate) return 'Tasa por defecto';
    
    if (this.exchangeRate.nombre) {
      return this.exchangeRate.nombre;
    } else if (this.exchangeRate.fuente) {
      return this.exchangeRate.fuente;
    } else {
      return 'BCV Oficial';
    }
  }

  initializePaypal() {
    paypal.Buttons({
      style: {
        color: "gold",
        shape: "rect",
        layout: "vertical"
      },

      createOrder: (data:any, actions:any) => {
        if(this.totalSum == 0){
          alertDanger("NO PUEDES PAGAR UN MONTO DE 0");
          return false;
        }
        if(this.listCarts.length == 0){
          alertDanger("NO PUEDES PROCESAR EL PAGO CON NINGUN CURSO EN EL CARRITO");
          return false;
        }
        
        const createOrderPayload = {
          purchase_units: [
            {
              amount: {
                description: "COMPRAR POR EL ECOMMERCE",
                value: this.totalSum
              }
            }
          ]
        };

        return actions.order.create(createOrderPayload);
      },

      onApprove: async (data:any, actions:any) => {
        this.isProcessingPaypal = true;
        
        try {
          let Order = await actions.order.capture();
          let dataT = {
            method_payment: "PAYPAL",
            currency_total: "USD",
            currency_payment: "USD",
            total: this.totalSum,
            n_transaccion: Order.purchase_units[0].payments.captures[0].id,
          }
          
          this.processPayment(dataT);
        } catch (error) {
          console.error('Error en PayPal:', error);
          alertDanger("Error al procesar el pago con PayPal");
          this.isProcessingPaypal = false;
        }
      },

      onError: (err:any) => {
        console.error('Error en PayPal:', err);
        this.isProcessingPaypal = false;
        alertDanger("Error al procesar el pago con PayPal");
      },

      onCancel: (data:any) => {
        this.isProcessingPaypal = false;
        console.log('Pago con PayPal cancelado');
      }

    }).render(this.paypalElement?.nativeElement);
  }

  // MÉTODO ACTUALIZADO PARA PAGO MÓVIL - AHORA ABRE EL MODAL
  onPagoMovilClick() {
    if(this.totalSum == 0){
      alertDanger("NO PUEDES PAGAR UN MONTO DE 0");
      return;
    }
    if(this.listCarts.length == 0){
      alertDanger("NO PUEDES PROCESAR EL PAGO CON NINGUN CURSO EN EL CARRITO");
      return;
    }

    // Verificar que tenemos la tasa de cambio
    if (this.usdToBsRate === 0) {
      alertDanger("Cargando tasa de cambio, por favor espera...");
      this.loadOfficialExchangeRate();
      return;
    }

    this.isPagoMovilLoading = true;
    
    // Simular carga inicial y luego abrir modal
    setTimeout(() => {
      this.isPagoMovilLoading = false;
      this.openPagoMovilModal();
    }, 1000);
  }

  // Método para Binance (SIN CAMBIOS)
  onBinanceClick() {
    if(this.totalSum == 0){
      alertDanger("NO PUEDES PAGAR UN MONTO DE 0");
      return;
    }
    if(this.listCarts.length == 0){
      alertDanger("NO PUEDES PROCESAR EL PAGO CON NINGUN CURSO EN EL CARRITO");
      return;
    }

    this.isBinanceLoading = true;
    
    // Simular proceso de pago con Binance (aquí integrarías con Binance API)
    setTimeout(() => {
      let dataT = {
        method_payment: "BINANCE",
        currency_total: "USD",
        currency_payment: "USD",
        total: this.totalSum,
        n_transaccion: "BIN_" + Date.now(), // Generar ID único
      }
      
      this.processPayment(dataT);
    }, 2000);
  }

  // Método común para procesar pagos (ACTUALIZADO para Pago Móvil)
  processPayment(dataT: any) {
    this.cartService.checkout(dataT).subscribe({
      next: (resp:any) => {
        console.log(resp);
        if (resp.message == 200) {
          alertSuccess(resp.message_text);
          this.cartService.resetCart();
          this.router.navigate(['/']);
        } else {
          alertDanger(resp.message_text || "Ocurrió un error desconocido al finalizar la compra.");
        }
        
        // Resetear estados de carga
        this.isPagoMovilLoading = false;
        this.isBinanceLoading = false;
        this.isProcessingPaypal = false;
      },
      error: (err:any) => {
        console.error('Error durante el checkout:', err);
        alertDanger("Hubo un error en el servidor al registrar la compra.");
        
        // Resetear estados de carga
        this.isPagoMovilLoading = false;
        this.isBinanceLoading = false;
        this.isProcessingPaypal = false;
      }
    });
  }

  // FUNCIONES DEL MODAL DE PAGO MÓVIL
  openPagoMovilModal() {
    this.resetModal();
    const modal = new bootstrap.Modal(this.pagoMovilModal.nativeElement);
    modal.show();
  }

  resetModal() {
    this.currentStep = 1;
    this.selectedFile = null;
    this.filePreview = null;
    this.isVerificationComplete = false;
    this.verificationProgress = 0;
    this.clearVerificationInterval();
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isFileOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isFileOver = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isFileOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alertDanger('Por favor, selecciona solo archivos de imagen');
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      alertDanger('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    this.selectedFile = file;
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.filePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  submitPayment() {
    if (!this.selectedFile) {
      alertDanger('Por favor, selecciona un comprobante');
      return;
    }

    this.currentStep = 3;
    this.startVerificationProcess();
  }

  startVerificationProcess() {
    this.verificationProgress = 0;
    
    this.verificationInterval = setInterval(() => {
      this.verificationProgress += 10;
      
      if (this.verificationProgress >= 100) {
        this.clearVerificationInterval();
        this.isVerificationComplete = true;
      }
    }, 1000);
  }

  clearVerificationInterval() {
    if (this.verificationInterval) {
      clearInterval(this.verificationInterval);
      this.verificationInterval = null;
    }
  }

  checkVerificationStatus() {
    // Simular verificación del estado
    if (this.verificationProgress < 100) {
      this.verificationProgress = Math.min(this.verificationProgress + 20, 100);
      
      if (this.verificationProgress >= 100) {
        this.isVerificationComplete = true;
        this.clearVerificationInterval();
      }
    }
  }

  onPaymentComplete() {
    // Cerrar modal primero
    const modal = bootstrap.Modal.getInstance(this.pagoMovilModal.nativeElement);
    if (modal) {
      modal.hide();
    }

    // Procesar el pago con los datos actualizados
    let dataT = {
      method_payment: "PAGO_MOVIL",
      currency_total: "USD",
      currency_payment: "VES", // Cambiado a Bolívares
      total: this.totalSum,
      total_bs: this.totalSumBs, // Enviar monto en Bs
      exchange_rate: this.usdToBsRate, // Enviar tasa de cambio usada
      exchange_source: this.getRateSource(), // Fuente de la tasa
      exchange_last_update: this.lastUpdate, // Última actualización
      n_transaccion: "PM_" + Date.now(),
      comprobante: this.filePreview // Enviar el comprobante en base64
    }
    
    this.processPayment(dataT);
  }

  // Actualizar tasa de cambio manualmente
  refreshRates() {
    this.loadOfficialExchangeRate();
    alertSuccess('Tasa de cambio actualizada');
  }

  // TUS FUNCIONES ORIGINALES (SIN CAMBIOS)
  getNameCampaing(type:number){
    let Name = "";
    switch (type) {
      case 1:
        Name = "CAMPAÑA NORMAL"
        break;
      case 2:
        Name = "CAMPAÑA FLASH"
        break;
      case 3:
        Name = "CAMPAÑA BANNER"
        break;
      default:
        break;
    }
    return Name;
  }

  removeItem(cart:any){
    this.cartService.deleteCart(cart.id).subscribe((resp:any) => {
      console.log(resp);
      alertSuccess("EL ITEM SE A ELIMINADO CORRECTAMENTE ");
      this.cartService.removeItemCart(cart);
    })
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.filePreview = null;
  }

  applyCupon(){
    if(!this.code){
      alertDanger("NECESITAS INGRESAR UN CUPON");
      return;
    }
    let data = {
      code: this.code,
    }
    this.cartService.applyCupon(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alertDanger(resp.message_text);
      }else{
        this.cartService.resetCart();
        setTimeout(() => {
          resp.carts.data.forEach((cart:any) => {
            this.cartService.addCart(cart);
          });
        }, 50);
        alertSuccess("EL CUPON SE HA REGISTRADO CORRECTAMENTE");
      }
    })
  }
}