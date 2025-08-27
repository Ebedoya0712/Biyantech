import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TiendaGuestService } from '../service/tienda-guest.service';
import { CartService } from '../service/cart.service';

declare function courseView():any;
declare function showMoreBtn():any;
declare function magnigyPopup():any;
declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;

@Component({
  selector: 'app-courses-detail',
  templateUrl: './courses-detail.component.html',
  styleUrls: ['./courses-detail.component.css']
})
export class CoursesDetailComponent implements OnInit{
  
  SLUG:any = null;
  LANDING_COURSE:any = null;
  courses_related_instructor:any = [];
  courses_related_categories:any = [];
  campaing_discount_id:any
  DISCOUNT:any = null;
  user: any = null;

  is_have_course:any = false;
  constructor(
    public activedRouter: ActivatedRoute,
    public tiendaGuestService: TiendaGuestService,
    public cartService: CartService,
    public router:Router,
  ) {
    
  }
  ngOnInit(): void {
    this.activedRouter.params.subscribe((resp:any) => {
      console.log(resp);
      this.SLUG = resp.slug;
    })
    this.activedRouter.queryParams.subscribe((resp:any) => {
      console.log(resp);
      this.campaing_discount_id = resp.campaing_discount;
    })
    this.tiendaGuestService.landingCourse(this.SLUG,this.campaing_discount_id).subscribe((resp:any) => {
      console.log(resp);
      this.LANDING_COURSE = resp.course;
      this.courses_related_instructor = resp.courses_related_instructor;
      this.courses_related_categories = resp.courses_related_categories;
      this.DISCOUNT = resp.DISCOUNT;
      if(this.DISCOUNT){
        this.LANDING_COURSE.discount_g = resp.DISCOUNT;
      }
      setTimeout(() => {
        magnigyPopup();
      }, 50);
      this.is_have_course = resp.is_have_course;
    });
    setTimeout(() => {
      courseView();
      showMoreBtn();
    }, 50);
    this.user = this.cartService.authService.user;
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

  addCart(){
    if(!this.user){
      alertWarning("NECESITAS REGISTRARTE EN LA TIENDA");
      this.router.navigateByUrl("auth/login");
      return;
    }
    let data = {
      course_id: this.LANDING_COURSE.id,
      type_discount: this.LANDING_COURSE.discount_g ? this.LANDING_COURSE.discount_g.type_discount : null,
      discount: this.LANDING_COURSE.discount_g ? this.LANDING_COURSE.discount_g.discount : null,
      type_campaing: this.LANDING_COURSE.discount_g ? this.LANDING_COURSE.discount_g.type_campaing : null,
      code_cupon: null,
      code_discount: this.LANDING_COURSE.discount_g ? this.LANDING_COURSE.discount_g.code : null,
      precio_unitario: this.LANDING_COURSE.precio_usd,
      total: this.getTotalPriceCourse(this.LANDING_COURSE),
    };

    this.cartService.registerCart(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alertDanger(resp.message_text);
        return;
      }else{
        this.cartService.addCart(resp.cart);
        alertSuccess("EL CURSO SE AGREGO AL CARRITO EXITOSAMENTE");
      }
    })
  }
}
