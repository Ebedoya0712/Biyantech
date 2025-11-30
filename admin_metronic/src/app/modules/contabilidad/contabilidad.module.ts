import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContabilidadRoutingModule } from './contabilidad-routing.module';
import { FinancieraComponent } from './components/financiera/financiera.component';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { CostosComponent } from './components/costos/costos.component';
import { DepartamentosComponent } from './components/departamentos/departamentos.component';

@NgModule({
  declarations: [
    FinancieraComponent,
    IngresosComponent,
    CostosComponent,
    DepartamentosComponent
  ],
  imports: [
    CommonModule,
    ContabilidadRoutingModule
  ]
})
export class ContabilidadModule { }