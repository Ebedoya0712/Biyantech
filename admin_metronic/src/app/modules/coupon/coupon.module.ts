import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Módulos de Angular
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Módulos de terceros
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';

// Routing
import { CouponRoutingModule } from './coupon-routing.module';

// Componentes
import { CouponComponent } from './coupon.component';
import { CouponAddComponent } from './coupon-add/coupon-add.component';
import { CouponListComponent } from './coupon-list/coupon-list.component';
import { EditComponent } from './coupon-edit/coupon-edit.component';
import { DeleteComponent } from './coupon-delete/coupon-delete.component';

@NgModule({
  declarations: [
    CouponComponent,
    CouponAddComponent,
    CouponListComponent,
    EditComponent,
    DeleteComponent
  ],
  imports: [
    // Módulos de Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
    // Routing
    CouponRoutingModule,
    
    // Módulos de terceros
    NgbModule,
    NgbModalModule,
    InlineSVGModule
  ]
})
export class CouponModule { }