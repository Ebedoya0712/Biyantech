import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancialAccountingComponent } from './financial-accounting/financial-accounting.component';
import { RevenueAccountingComponent } from './revenue-accounting/revenue-accounting.component';
import { CostAccountingComponent } from './cost-accounting/cost-accounting.component';
import { DepartmentalAccountingComponent } from './departmental-accounting/departmental-accounting.component';

const routes: Routes = [
  {
    path: 'financial',
    component: FinancialAccountingComponent,
    data: { title: 'Contabilidad Financiera' }
  },
  {
    path: 'revenue',
    component: RevenueAccountingComponent,
    data: { title: 'Contabilidad de Ingresos' }
  },
  {
    path: 'cost',
    component: CostAccountingComponent,
    data: { title: 'Contabilidad de Costos' }
  },
  {
    path: 'departmental',
    component: DepartmentalAccountingComponent,
    data: { title: 'Contabilidad por Departamentos' }
  },
  {
    path: '',
    redirectTo: 'financial',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }