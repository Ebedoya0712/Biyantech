import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiendaAuthComponent } from './tienda-auth.component';
import { ListCartsComponent } from './list-carts/list-carts.component';
import { ProfileClientComponent } from './profile-client/profile-client.component';

const routes: Routes = [{
  path: '',
  component: TiendaAuthComponent,
  children: [
    {
    path: 'carrito-de-compra',
    component: ListCartsComponent,
    },
    {
      path: 'perfil-del-cliente',
      component: ProfileClientComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiendaAuthRoutingModule { }
