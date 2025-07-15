import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiendaAuthComponent } from './tienda-auth.component';
import { ListCartsComponent } from './list-carts/list-carts.component';

const routes: Routes = [{
  path: '',
  component: TiendaAuthComponent,
  children: [{
    path: 'carrito-de-compra',
    component: ListCartsComponent,
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiendaAuthRoutingModule { }
