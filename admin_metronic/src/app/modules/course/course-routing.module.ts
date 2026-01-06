import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course.component';
import { CourseAddComponent } from './course-add/course-add.component';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { CourseListComponent } from './course-list/course-list.component';
import { SectionAddComponent } from './section/section-add/section-add.component';
import { ClaseAddComponent } from './section/clases/clase-add/clase-add.component';

// 🚨 Importamos el nuevo componente de pagos pendientes
import { PagosMovilPendientesComponent } from './pagos-movil-pendientes/pagos-movil-pendientes.component';
import { CourseTrailerComponent } from './course-trailer/course-trailer.component';

const routes: Routes = [{
  path: '',
  component: CourseComponent,
  children: [
    {
      path: 'registro',
      component: CourseAddComponent,
    },
    {
      path: 'list',
      component: CourseListComponent
    },
    {
      path: 'list/editar/:id',
      component: CourseEditComponent,
    },
    {
      path: 'list/secciones/:id',
      component: SectionAddComponent,
    },
    {
      path: 'list/secciones/clases/:id',
      component: ClaseAddComponent,
    },
    // 🚨 NUEVA RUTA: Listado de Pagos Móviles Pendientes
    {
        path: 'pagos-movil-pendientes', 
        component: PagosMovilPendientesComponent,
    },
    {
        path: 'trailer',
        component: CourseTrailerComponent,
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }