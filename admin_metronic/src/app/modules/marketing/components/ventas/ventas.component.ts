import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
})
export class VentasComponent implements OnInit {

  terminoBusqueda: string = '';
  filtroEstado: string = '';
  periodoFunnel: string = '30';
  paginaActual: number = 1;
  itemsPorPagina: number = 10;

  funnelVentas = [
    {
      nombre: 'Visitantes',
      cantidad: 15842,
      tasa: '100%',
      color: 'primary',
      icono: 'fas fa-users'
    },
    {
      nombre: 'Leads',
      cantidad: 3568,
      tasa: '22.5%',
      color: 'info',
      icono: 'fas fa-user-plus'
    },
    {
      nombre: 'Oportunidades',
      cantidad: 1892,
      tasa: '11.9%',
      color: 'warning',
      icono: 'fas fa-handshake'
    },
    {
      nombre: 'Clientes',
      cantidad: 1248,
      tasa: '7.9%',
      color: 'success',
      icono: 'fas fa-user-check'
    }
  ];

  metricas = {
    ventasTotales: 1248,
    ingresosTotales: 124580,
    tasaConversion: 3.2,
    ticketPromedio: 98.75,
    tendenciaVentas: 12,
    tendenciaIngresos: 18,
    tendenciaConversion: 0.4,
    tendenciaTicket: 8.25
  };

  ventasRecientes = [
    {
      orden: 'ORD-001284',
      cliente: 'Carlos Rodríguez',
      email: 'carlos@email.com',
      iniciales: 'CR',
      colorAvatar: 'primary',
      producto: 'Curso Angular Avanzado',
      categoria: 'Programación',
      monto: '89.00',
      metodoPago: 'PayPal',
      metodoColor: 'primary',
      fecha: '15/03/2024',
      estado: 'Completado',
      estadoColor: 'success'
    },
    {
      orden: 'ORD-001283',
      cliente: 'Ana Martínez',
      email: 'ana@email.com',
      iniciales: 'AM',
      colorAvatar: 'success',
      producto: 'Certificación FullStack',
      categoria: 'Programación',
      monto: '299.00',
      metodoPago: 'Binance',
      metodoColor: 'success',
      fecha: '14/03/2024',
      estado: 'Completado',
      estadoColor: 'success'
    },
    {
      orden: 'ORD-001282',
      cliente: 'Miguel Sánchez',
      email: 'miguel@email.com',
      iniciales: 'MS',
      colorAvatar: 'warning',
      producto: 'Diseño UI/UX Profesional',
      categoria: 'Diseño',
      monto: '156.00',
      metodoPago: 'Pago Móvil',
      metodoColor: 'info',
      fecha: '14/03/2024',
      estado: 'Procesando',
      estadoColor: 'warning'
    },
    {
      orden: 'ORD-001281',
      cliente: 'Laura González',
      email: 'laura@email.com',
      iniciales: 'LG',
      colorAvatar: 'danger',
      producto: 'Suscripción Premium Anual',
      categoria: 'Suscripción',
      monto: '199.00',
      metodoPago: 'PayPal',
      metodoColor: 'primary',
      fecha: '13/03/2024',
      estado: 'Completado',
      estadoColor: 'success'
    },
    {
      orden: 'ORD-001280',
      cliente: 'Roberto Silva',
      email: 'roberto@email.com',
      iniciales: 'RS',
      colorAvatar: 'info',
      producto: 'Curso React Native',
      categoria: 'Programación',
      monto: '75.00',
      metodoPago: 'Binance',
      metodoColor: 'success',
      fecha: '13/03/2024',
      estado: 'Pendiente',
      estadoColor: 'danger'
    }
  ];

  get totalVisitantes(): number {
    return this.funnelVentas[0].cantidad;
  }

  get totalClientes(): number {
    return this.funnelVentas[3].cantidad;
  }

  get ventasFiltradas(): any[] {
    let filtradas = this.ventasRecientes;

    // Filtrar por término de búsqueda
    if (this.terminoBusqueda) {
      const term = this.terminoBusqueda.toLowerCase();
      filtradas = filtradas.filter(v => 
        v.cliente.toLowerCase().includes(term) ||
        v.producto.toLowerCase().includes(term) ||
        v.orden.toLowerCase().includes(term)
      );
    }

    // Filtrar por estado
    if (this.filtroEstado) {
      filtradas = filtradas.filter(v => v.estado.toLowerCase() === this.filtroEstado);
    }

    return filtradas;
  }

  constructor() { }

  ngOnInit(): void {
    this.inicializarGraficos();
  }

  inicializarGraficos() {
    // Lógica para inicializar gráficos
    console.log('Inicializando gráficos de ventas...');
  }

  actualizarFunnel() {
    console.log('Actualizando funnel para período:', this.periodoFunnel);
    // Lógica para actualizar datos del funnel
  }

  filtrarVentas() {
    this.paginaActual = 1;
  }

  exportarReporte() {
    console.log('Exportando reporte de ventas...');
    // Lógica para exportar reporte
  }

  verDetalle(venta: any) {
    console.log('Viendo detalle de venta:', venta);
    // Lógica para ver detalle
  }

  editarVenta(venta: any) {
    console.log('Editando venta:', venta);
    // Lógica para editar venta
  }

  cambiarPagina(pagina: number) {
    this.paginaActual = pagina;
  }
}