import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timeout } from 'rxjs';
import { TiendaGuestService } from '../service/tienda-guest.service';

declare function courseView(): any;
declare function showMoreBtn(): any;
declare function magnigyPopup(): any;

@Component({
  selector: 'app-courses-detail',
  templateUrl: './courses-detail.component.html',
  styleUrls: ['./courses-detail.component.css']
})
export class CoursesDetailComponent implements OnInit {

  SLUG:any = null;
  LANDING_COURSE:any = null;
  courses_related_instructor:any = [];
  courses_related_categories:any = [];
  constructor(
    public activedRouter: ActivatedRoute,
    public tiendaGuestService: TiendaGuestService,
  ) {

  }

  ngOnInit(): void {
    this.activedRouter.params.subscribe((resp:any) =>{
      console.log(resp);
      this.SLUG = resp.slug;
    })
    this.tiendaGuestService.landingCourse(this.SLUG).subscribe((resp:any) => {
      console.log(resp);
      this.LANDING_COURSE = resp.course;
      this.courses_related_instructor = resp.courses_related_instructor;
      this.courses_related_categories = resp.courses_related_categories;

      setTimeout(() => {
        magnigyPopup();
      }, 50);
    });
    setTimeout(() =>{
      courseView();
      showMoreBtn();
      
    },50);
  }

  getNewTotal(COURSE:any,DESCOUNT_BANNER:any){
    if(DESCOUNT_BANNER.type_discount == 1){
      return COURSE.precio_usd - COURSE.precio_usd*(DESCOUNT_BANNER.discount*0.01);
    }else{
      return COURSE.precio_usd - DESCOUNT_BANNER.discount;
    }
  }

  getTotalPriceCourse(COURSE:any){
    if(COURSE.discount_g){
      return this.getNewTotal(COURSE,COURSE.discount_g);
    }
    return COURSE.precio_usd;
  }
}


