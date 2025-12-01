import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-financiera',
  templateUrl: './financiera.component.html',
})
export class FinancieraComponent implements OnInit {
  
  transacciones = [
    {
      fecha: '15/03/2024',
      descripcion: 'Venta Curso Angular',
      categoria: 'Ingreso Cursos',
      metodoPago: 'PayPal',
      ingreso: 89,
      gasto: 0,
      saldo: 89,
      estado: 'Completado'
    },
    {
      fecha: '14/03/2024',
      descripcion: 'Pago a Docente',
      categoria: 'Gasto Docentes',
      metodoPago: 'Pago Móvil',
      ingreso: 0,
      gasto: 35,
      saldo: -35,
      estado: 'Pendiente'
    },
    {
      fecha: '13/03/2024',
      descripcion: 'Comisión Referido',
      categoria: 'Gasto Referidos',
      metodoPago: 'Binance',
      ingreso: 0,
      gasto: 45,
      saldo: -45,
      estado: 'Completado'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.inicializarGraficos();
  }

  inicializarGraficos() {
    // Lógica para gráficos de ingresos vs gastos
    console.log('Inicializando gráficos financieros...');
  }
}