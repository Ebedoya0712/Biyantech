import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
})
export class IngresosComponent implements OnInit {
  
  // Definir la propiedad ingresos que se usa en el template
  ingresos = [
    {
      fecha: '15/03/2024',
      concepto: 'Venta Curso Angular Avanzado',
      fuente: 'Cursos',
      metodoPago: 'PayPal',
      monto: '89',
      comision: '8.90',
      neto: '80.10',
      color: 'success',
      metodoColor: 'primary'
    },
    {
      fecha: '14/03/2024',
      concepto: 'Suscripción Premium Anual',
      fuente: 'Suscripciones',
      metodoPago: 'Binance',
      monto: '299',
      comision: '14.95',
      neto: '284.05',
      color: 'success',
      metodoColor: 'success'
    },
    {
      fecha: '13/03/2024',
      concepto: 'Desarrollo App Móvil',
      fuente: 'Servicios Dev',
      metodoPago: 'Transferencia',
      monto: '2500',
      comision: '125',
      neto: '2375',
      color: 'info',
      metodoColor: 'info'
    },
    {
      fecha: '12/03/2024',
      concepto: 'Diseño Logo Corporativo',
      fuente: 'Servicios Diseño',
      metodoPago: 'Pago Móvil',
      monto: '350',
      comision: '17.50',
      neto: '332.50',
      color: 'warning',
      metodoColor: 'info'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.inicializarGraficos();
  }

  inicializarGraficos() {
    // Lógica para inicializar gráficos
    console.log('Inicializando gráficos de ingresos...');
  }
}