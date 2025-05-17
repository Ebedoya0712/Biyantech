import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../service/course.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-section-add',
  templateUrl: './section-add.component.html',
  styleUrls: ['./section-add.component.scss']
})
export class SectionAddComponent implements OnInit {

  course_id:any;
  isLoading:any;

  title:any;
  constructor(
    public courseService:CourseService,
    public activedrouter:ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.activedrouter.params.subscribe((resp:any) =>{
      console.log(resp);
      this.course_id = resp.id;
    })
  }

  save(){
    
  }

}
