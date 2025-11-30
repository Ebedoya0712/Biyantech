import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancieraComponent } from './components/financiera/financiera.component';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { CostosComponent } from './components/costos/costos.component';
import { DepartamentosComponent } from './components/departamentos/departamentos.component';

const routes: Routes = [
  { path: 'financiera', component: FinancieraComponent },
  { path: 'ingresos', component: IngresosComponent },
  { path: 'costos', component: CostosComponent },
  { path: 'departamentos', component: DepartamentosComponent },
  { path: '', redirectTo: 'financiera', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContabilidadRoutingModule { }