import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { ActivatedRoute } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SectionEditComponent } from '../section-edit/section-edit.component';

@Component({
  selector: 'app-section-add',
  templateUrl: './section-add.component.html',
  styleUrls: ['./section-add.component.scss']
})
export class SectionAddComponent implements OnInit {

  course_id:any;
  isLoading:any;

  title:any;

  SECTIONS:any = [];
  constructor(
    public courseService:CourseService,
    public activedrouter:ActivatedRoute,
    public toaster: Toaster,
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.activedrouter.params.subscribe((resp:any) =>{
      console.log(resp);
      this.course_id = resp.id;
    })

    this.courseService.listSections().subscribe((resp:any) =>{
      console.log(resp);
      this.SECTIONS = resp.sections;
    })
  }

  editSection(SECTION:any){
    const modalref = this.modalService.open(SectionEditComponent,{ centered: true, size: 'md'});
    modalref.componentInstance.section_selected = SECTION;

    modalref.componentInstance.SectionE.subscribe((newSection:any) =>{
        let INDEX = this.SECTIONS.findIndex(((item:any )=> item.id == newSection.id));
        if(INDEX != -1){
            this.SECTIONS[INDEX] = newSection;
        }
    });
  }
  save(){
    if(!this.title){
          this.toaster.open({text: "NECESITAS INGRESAR UN NOMBRE PARA LA SECCION", caption: "VALIDACION", type: 'danger'});
          return;
      }
    let data = {
      name: this.title,
      course_id: this.course_id,
      state: 1,
    }
    this.courseService.registerSection(data).subscribe((resp:any) =>{
      console.log(resp);
      this.title = null;
      this.SECTIONS.push(resp.section);
      this.toaster.open({text: "LA SECCION SE REGISTRO CORRECTAMENTE", caption: "SUCCESS", type: 'primary'});
    })
  }

}
