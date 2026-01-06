import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TiendaGuestComponent } from './tienda-guest.component';
import { CoursesDetailComponent } from './courses-detail/courses-detail.component';
import { FilterCoursesComponent } from './filter-courses/filter-courses.component';
import { CertificateVerificationComponent } from './certificate-verification/certificate-verification.component';

const routes: Routes = [
  {
    path: '',
    component: TiendaGuestComponent,
    children: [
      {
        path: 'landing-curso/:slug',
        component: CoursesDetailComponent
      },
      {
        path: 'listado-de-cursos',
        component: FilterCoursesComponent
      },
      {
        path: 'verificar-certificado/:code',
        component: CertificateVerificationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiendaGuestRoutingModule { }
