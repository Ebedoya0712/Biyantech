import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Cost {
  id: number;
  concept: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: string;
  courseId?: number;
  selected?: boolean;
}

interface Course {
  id: number;
  name: string;
}

@Component({
  selector: 'app-cost-accounting',
  templateUrl: './cost-accounting.component.html',
  styleUrls: ['./cost-accounting.component.scss']
})
export class CostAccountingComponent implements OnInit {
  costForm: FormGroup;
  costs: Cost[] = [];
  courses: Course[] = [];
  editingCost: Cost | null = null;

  constructor(private fb: FormBuilder) {
    this.costForm = this.createForm();
  }

  ngOnInit() {
    this.loadSampleData();
    this.loadCourses();
  }

  createForm(): FormGroup {
    return this.fb.group({
      concept: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      status: ['ACTIVE'],
      courseId: ['']
    });
  }

  loadSampleData() {
    this.costs = [
      {
        id: 1,
        concept: 'Pago docente curso Angular',
        description: 'Pago mensual al instructor del curso de Angular avanzado',
        category: 'DOCENTES',
        amount: 2500,
        date: '2024-01-15',
        status: 'ACTIVE',
        courseId: 1
      },
      {
        id: 2,
        concept: 'Equipos de grabación',
        description: 'Cámaras y micrófonos para producción',
        category: 'EQUIPOS',
        amount: 5000,
        date: '2024-01-10',
        status: 'ACTIVE'
      },
      {
        id: 3,
        concept: 'Campaña Google Ads',
        description: 'Publicidad para promoción de cursos',
        category: 'MARKETING',
        amount: 1500,
        date: '2024-01-08',
        status: 'ACTIVE'
      },
      {
        id: 4,
        concept: 'Sueldo editor video',
        description: 'Pago quincenal editor de contenido',
        category: 'EMPLEADOS',
        amount: 1800,
        date: '2024-01-05',
        status: 'ACTIVE'
      },
      {
        id: 5,
        concept: 'Producción curso React',
        description: 'Gastos de producción para nuevo curso',
        category: 'PRODUCCION',
        amount: 3200,
        date: '2024-01-03',
        status: 'ACTIVE',
        courseId: 2
      }
    ];
  }

  loadCourses() {
    this.courses = [
      { id: 1, name: 'Angular Avanzado' },
      { id: 2, name: 'React Professional' },
      { id: 3, name: 'Node.js Backend' },
      { id: 4, name: 'Vue.js Completo' }
    ];
  }

  saveCost() {
    if (this.costForm.valid) {
      const formValue = this.costForm.value;

      if (this.editingCost) {
        // Actualizar costo existente
        const index = this.costs.findIndex(c => c.id === this.editingCost!.id);
        if (index !== -1) {
          this.costs[index] = { ...this.editingCost, ...formValue };
        }
      } else {
        // Crear nuevo costo
        const newCost: Cost = {
          id: Math.max(...this.costs.map(c => c.id)) + 1,
          ...formValue
        };
        this.costs.push(newCost);
      }

      this.resetForm();
      this.closeModal();
    }
  }

  editCost(cost: Cost) {
    this.editingCost = cost;
    this.costForm.patchValue(cost);
    this.openModal();
  }

  deleteCost(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este costo?')) {
      this.costs = this.costs.filter(cost => cost.id !== id);
    }
  }

  resetForm() {
    this.costForm.reset({
      concept: '',
      description: '',
      category: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      courseId: ''
    });
    this.editingCost = null;
  }

  openModal() {
    const modal = document.getElementById('kt_modal_add_cost');
    if (modal) {
      // Usar Bootstrap para abrir el modal
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  closeModal() {
    const modal = document.getElementById('kt_modal_add_cost');
    if (modal) {
      // Usar Bootstrap para cerrar el modal
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.hide();
    }
    this.resetForm();
  }

  // Métodos de cálculo - CORREGIDOS
  getTotalCosts(): number {
    return this.costs.reduce((total, cost) => total + cost.amount, 0);
  }

  getCostsByCategory(category: string): number {
    return this.costs
      .filter(cost => cost.category === category)
      .reduce((total, cost) => total + cost.amount, 0);
  }

  calculateMargin(): number {
    const totalRevenue = 50000; // Esto vendría del backend
    const totalCosts = this.getTotalCosts();
    const margin = ((totalRevenue - totalCosts) / totalRevenue * 100);
    return parseFloat(margin.toFixed(1)); // ← Corregido: convertir a número
  }

  // Métodos de utilidad para UI
  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'DOCENTES': 'fas fa-chalkboard-teacher text-primary',
      'PRODUCCION': 'fas fa-video text-info',
      'EQUIPOS': 'fas fa-laptop text-warning',
      'MARKETING': 'fas fa-bullhorn text-success',
      'EMPLEADOS': 'fas fa-users text-danger',
      'PLATAFORMA': 'fas fa-server text-secondary',
      'OTROS': 'fas fa-cube text-dark'
    };
    return icons[category] || 'fas fa-cube text-dark';
  }

  getCategoryBadge(category: string): string {
    const badges: { [key: string]: string } = {
      'DOCENTES': 'badge-light-primary',
      'PRODUCCION': 'badge-light-info',
      'EQUIPOS': 'badge-light-warning',
      'MARKETING': 'badge-light-success',
      'EMPLEADOS': 'badge-light-danger',
      'PLATAFORMA': 'badge-light-secondary',
      'OTROS': 'badge-light-dark'
    };
    return badges[category] || 'badge-light-dark';
  }

  getCategoryName(category: string): string {
    const names: { [key: string]: string } = {
      'DOCENTES': 'Pagos Docentes',
      'PRODUCCION': 'Producción Videos',
      'EQUIPOS': 'Equipos Producción',
      'MARKETING': 'Marketing',
      'EMPLEADOS': 'Empleados',
      'PLATAFORMA': 'Plataforma',
      'OTROS': 'Otros Gastos'
    };
    return names[category] || category;
  }

  getCostDistribution() {
    const categories = ['DOCENTES', 'PRODUCCION', 'EQUIPOS', 'MARKETING', 'EMPLEADOS', 'PLATAFORMA', 'OTROS'];
    const total = this.getTotalCosts();
    
    return categories.map(category => {
      const categoryTotal = this.getCostsByCategory(category);
      return {
        key: category,
        total: categoryTotal,
        percentage: total > 0 ? ((categoryTotal / total) * 100).toFixed(1) : '0.0'
      };
    }).filter(item => item.total > 0);
  }

  getMonthlySummary() {
    // Esto sería calculado desde el backend
    return [
      { name: 'Enero 2024', docentes: 7500, produccion: 9600, marketing: 4500, total: 21600 },
      { name: 'Diciembre 2023', docentes: 6800, produccion: 8200, marketing: 3800, total: 18800 },
      { name: 'Noviembre 2023', docentes: 7200, produccion: 7800, marketing: 4200, total: 19200 }
    ];
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.costs.forEach(cost => cost.selected = checked);
  }
}