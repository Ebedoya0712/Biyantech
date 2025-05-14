import { Component, OnInit } from '@angular/core';
import { CourseService } from '../service/course.service';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss']
})
export class CourseAddComponent implements OnInit {

  subcategories:any = [];
  subcategories_back: any = [];
  categories: any = [];
  instructores:any = [];

  isLoading:any;
  constructor(
    public courseService: CourseService,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.courseService.listConfig().subscribe((resp:any) =>{
      console.log(resp);
      this.subcategories = resp.subcategories;
      this.categories = resp.categories;
      this.instructores = resp.instructores;
    })
  }

      selectCategorie(event:any){
        let VALUE = event.target.value;
          console.log(VALUE);
          this.subcategories_back = this.subcategories.filter((item:any) => item.categorie_id == VALUE);
      }
  save(){
          
  }

  processFile($event:any){

  }
}
