import { Component, OnInit } from '@angular/core';
import { CourseService } from '../service/course.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  COURSES:any = [];
  isLoading:any;
  search:any = null;
  state:any = null;
  constructor(
    public courseService:CourseService,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.listCourse();
  }

  listCourse(){
    this.courseService.listCourse(this.search,this.state).subscribe((resp:any)=>{
      console.log(resp);
      this.COURSES = resp.courses.data;
    })
  }

  deleteCourse(COURSE:any){

  }

}
