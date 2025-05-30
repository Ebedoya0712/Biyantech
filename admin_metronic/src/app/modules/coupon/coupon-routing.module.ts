import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponComponent } from './coupon.component';
import { EditComponent } from './coupon-edit/coupon-edit.component';
import { CouponAddComponent } from './coupon-add/coupon-add.component';
import { CouponListComponent } from './coupon-list/coupon-list.component';

const routes: Routes = [
  {
    path: '',
    component: CouponComponent,
    children: [
      {
        path: 'registro',
        component: CouponAddComponent,
      },
      {
        path: 'editar/:id',
        component: EditComponent,
      },
      {
        path: 'list',
        component: CouponListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponRoutingModule { }
