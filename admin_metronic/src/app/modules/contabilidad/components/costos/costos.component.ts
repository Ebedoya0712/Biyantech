import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-costos',
  templateUrl: './costos.component.html',
})
export class CostosComponent implements OnInit {
  
  costos = [
    {
      fecha: '15/03/2024',
      descripcion: 'Pago comisión docente - Curso Angular Avanzado',
      categoria: 'Pagos Docentes',
      proveedor: 'Prof. María González',
      monto: 120.00,
      iva: 0.00,
      total: 120.00,
      estado: 'Pagado'
    },
    {
      fecha: '14/03/2024',
      descripcion: 'Campaña marketing digital - Facebook Ads',
      categoria: 'Marketing',
      proveedor: 'Meta Platforms',
      monto: 350.00,
      iva: 52.50,
      total: 402.50,
      estado: 'Pendiente'
    },
    {
      fecha: '13/03/2024',
      descripcion: 'Servicio hosting premium - Amazon AWS',
      categoria: 'Hosting',
      proveedor: 'Amazon Web Services',
      monto: 89.00,
      iva: 13.35,
      total: 102.35,
      estado: 'Pagado'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.inicializarGraficos();
  }

  inicializarGraficos() {
    // Lógica para gráficos de costos
    console.log('Inicializando gráficos de costos...');
  }

  // Método para abrir modal de registro (si es necesario)
  abrirModalRegistro() {
    // Lógica para abrir modal
  }
}