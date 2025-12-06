import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from './service/dashboard.service';
import { getCSSVariableValue } from '../../_metronic/kt/_utils'; // Ajustar ruta si es necesario

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  stats: any = {};
  recent_sales: any[] = [];
  latest_students: any[] = [];
  latest_instructors: any[] = [];
  best_courses: any[] = [];
  categories_list: any[] = [];
  active_courses: any[] = [];

  // Charts
  chartOptionsRevenue: any = {};
  chartOptionsCategories: any = {};

  constructor(
    public dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.dashboardService.getDataDashboard().subscribe((resp: any) => {
      console.log(resp);
      this.stats = resp.stats;
      this.recent_sales = resp.recent_sales;
      this.latest_students = resp.latest_students;
      this.latest_instructors = resp.latest_instructors;
      this.best_courses = resp.best_courses;
      this.categories_list = resp.categories_list;
      this.active_courses = resp.active_courses;

      // Configurar Charts
      this.setupRevenueChart(resp.charts.revenue_by_month);
      this.setupCategoriesChart(resp.charts.courses_by_category);
      this.cdr.detectChanges();
    })
  }

  setupRevenueChart(data: any[]) {
    const months = data.map(item => item.month_name);
    const values = data.map(item => parseFloat(item.total));

    this.chartOptionsRevenue = {
      series: [{
        name: "Ingresos",
        data: values
      }],
      chart: {
        height: 350,
        type: 'area', // Cambiado a area para mejor visualización
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      title: {
        text: 'Ingresos Mensuales (USD)',
        align: 'left'
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
      },
      xaxis: {
        categories: months,
      }
    };
  }

  setupCategoriesChart(data: any[]) {
    const labels = data.map(item => item.name);
    const values = data.map(item => item.value);

    this.chartOptionsCategories = {
      series: values,
      chart: {
        width: 450, // Aumentado el ancho
        type: 'donut', // Cambiado a Donut para estilo moderno
      },
      labels: labels,
      legend: {
        position: 'bottom' // Leyenda abajo para dar espacio
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: 'bottom' }
        }
      }]
    };
  }
}
