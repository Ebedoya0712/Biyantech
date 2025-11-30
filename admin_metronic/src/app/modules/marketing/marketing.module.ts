import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingRoutingModule } from './marketing-routing.module';
import { VentasComponent } from './components/ventas/ventas.component';
import { AutorizacionPagosComponent } from './components/autorizacion-pagos/autorizacion-pagos.component';
import { CampanasComponent } from './components/campanas/campanas.component';
import { PromocionesComponent } from './components/promociones/promociones.component';

@NgModule({
  declarations: [
    VentasComponent,
    AutorizacionPagosComponent,
    CampanasComponent,
    PromocionesComponent
  ],
  imports: [
    CommonModule,
    MarketingRoutingModule
  ]
})
export class MarketingModule { }