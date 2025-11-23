import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // ← Agregar esta importación

import { AccountingRoutingModule } from './accounting-routing.module';
import { FinancialAccountingComponent } from './financial-accounting/financial-accounting.component';
import { RevenueAccountingComponent } from './revenue-accounting/revenue-accounting.component';
import { CostAccountingComponent } from './cost-accounting/cost-accounting.component';
import { DepartmentalAccountingComponent } from './departmental-accounting/departmental-accounting.component';

@NgModule({
  declarations: [
    FinancialAccountingComponent,
    RevenueAccountingComponent,
    CostAccountingComponent,
    DepartmentalAccountingComponent
  ],
  imports: [
    CommonModule,
    AccountingRoutingModule,
    ReactiveFormsModule // ← Agregar esto aquí
  ]
})
export class AccountingModule { }