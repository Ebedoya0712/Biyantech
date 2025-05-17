import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course.component';
import { CourseAddComponent } from './course-add/course-add.component';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { CourseListComponent } from './course-list/course-list.component';
import { SectionAddComponent } from './section/section-add/section-add.component';

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
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseRoutingModule { }
