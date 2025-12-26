import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountingComponent } from './accounting.component';
import { FinancialComponent } from './financial/financial.component';
import { RevenueComponent } from './revenue/revenue.component';
import { CostsComponent } from './costs/costs.component';
import { DepartmentComponent } from './department/department.component';

const routes: Routes = [
  {
    path: '',
    component: AccountingComponent,
    children: [
      { path: 'financial', component: FinancialComponent },
      { path: 'revenue', component: RevenueComponent },
      { path: 'costs', component: CostsComponent },
      { path: 'departments', component: DepartmentComponent },
      { path: '', redirectTo: 'financial', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
