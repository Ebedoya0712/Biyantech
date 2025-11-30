import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './components/ventas/ventas.component';
import { AutorizacionPagosComponent } from './components/autorizacion-pagos/autorizacion-pagos.component';
import { CampanasComponent } from './components/campanas/campanas.component';
import { PromocionesComponent } from './components/promociones/promociones.component';

const routes: Routes = [
  { path: 'ventas', component: VentasComponent },
  { path: 'autorizacion-pagos', component: AutorizacionPagosComponent },
  { path: 'campanas', component: CampanasComponent },
  { path: 'promociones', component: PromocionesComponent },
  { path: '', redirectTo: 'ventas', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }