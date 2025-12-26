import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2'; 
import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingComponent } from './accounting.component';
import { FinancialComponent } from './financial/financial.component';
import { RevenueComponent } from './revenue/revenue.component';
import { CostsComponent } from './costs/costs.component';
import { DepartmentComponent } from './department/department.component';

@NgModule({
  declarations: [
    AccountingComponent,
    FinancialComponent,
    RevenueComponent,
    CostsComponent,
    DepartmentComponent
  ],
  imports: [
    CommonModule,
    AccountingRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    InlineSVGModule
  ]
})
export class AccountingModule { }
