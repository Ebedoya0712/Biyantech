import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './modules/auth/service/auth.guard';
import { HomeComponent } from './modules/home/home.component'; // Importar si es necesario para el path loading

export const routes: Routes = [
  // 🚨 RUTA TEMPORAL AÑADIDA PARA FORZAR LA RECARGA DESDE EL CHECKOUT
  // Nota: Esta ruta permite el salto temporal sin cambiar la URL visible.
  {
    path: 'home-loading', 
    loadChildren: () => import("./modules/home/home.module").then(m => m.HomeModule),
  },
  
  {
    path: '',
    //canActivate: [AuthGuard],
    //loadChildren esta relacionado con la carga de modulos
    loadChildren: () => import("./modules/home/home.module").then(m => m.HomeModule),
  },
  {
    path: '',
    //canActivate: [AuthGuard],
    //loadChildren esta relacionado con la carga de modulos
    loadChildren: () => import("./modules/tienda-guest/tienda-guest.module").then(m => m.TiendaGuestModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    //loadChildren esta relacionado con la carga de modulos
    loadChildren: () => import("./modules/tienda-auth/tienda-auth.module").then(m => m.TiendaAuthModule),
  },
  {
    path: 'auth',
    loadChildren: () => import("./modules/auth/auth.module").then(m => m.AuthModule),
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404'
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule { }
