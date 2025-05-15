import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CourseService } from '../service/course.service';
import { Toaster } from 'ngx-toast-notifications';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-course-delete',
  templateUrl: './course-delete.component.html',
  styleUrls: ['./course-delete.component.scss']
})
export class CourseDeleteComponent implements OnInit {

  @Input() course:any;
  
    @Output() CourseD: EventEmitter<any> = new EventEmitter();
    isLoading:any;
    constructor(
      public courseService: CourseService,
      public toaster:Toaster,
      public modal: NgbActiveModal,
    ) { }
  
    ngOnInit(): void {
      this.isLoading = this.courseService.isLoading$;
    }
  
    delete(){
      this.courseService.deleteCourses(this.course.id).subscribe((resp:any) => {
        // console.log(resp)
        this.CourseD.emit("");
        this.modal.dismiss();
      })
    }

}
