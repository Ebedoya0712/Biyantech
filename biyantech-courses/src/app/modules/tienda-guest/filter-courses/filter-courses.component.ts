import { Component } from '@angular/core';
import { TiendaGuestService } from '../service/tienda-guest.service';
import { CartService } from '../service/cart.service';
import { ActivatedRoute, Router } from '@angular/router';

// declare function filterClickButton():any;
declare var $:any;
declare function showMoreBtn():any;
declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-filter-courses',
  templateUrl: './filter-courses.component.html',
  styleUrls: ['./filter-courses.component.css']
})
export class FilterCoursesComponent {

  CATEGORIES:any = [];
  INSTRUCTORES:any = [];
  LEVELS:any = [];
  IDIOMAS:any = [];

  selected_option:number = 1;

  LISTCOURSES:any = [];
  selected_categories:any = [];
  search:any = null;
  user:any = null;

  instructores_selected:any = [];
  min_price:number = 0;
  max_price:number = 0;
  idiomas_selected:any = [];
  levels_selected:any = [];

  rating_selected:number = 0;
  constructor(
    public tiendaGuestService: TiendaGuestService,
    public cartService: CartService,
    public router: Router,
    public actived: ActivatedRoute,
  ) {
    
  }
  ngOnInit(): void {

    this.user = this.tiendaGuestService.authService.user;
    // setTimeout(() => {
    //   // filterClickButton();
    //   $('#slider-range').slider({
    //     range: true,
    //     min: 10,
    //     max: 500,
    //     values: [0, 100],
    //     slide: (event:any, ui:any) => {
    //       console.log(ui.values[0],ui.values[1]);
    //         $('#amount').val('$' + ui.values[0] + ' - $' + ui.values[1]);
    //         this.min_price = ui.values[0];
    //         this.max_price = ui.values[1];
    //         this.listCourses();
    //     }
    //   });

    //   $('#amount').val('$' + $('#slider-range').slider('values', 0) +
    //       " - $" + $('#slider-range').slider('values', 1));
    // }, 50);
    
    this.tiendaGuestService.listConfig().subscribe((resp:any) => {
      console.log(resp);
      this.CATEGORIES = resp.categories;
      this.INSTRUCTORES = resp.instructores;
      this.LEVELS = resp.levels;
      this.IDIOMAS = resp.idiomas;

      setTimeout(() => {
        showMoreBtn();
      }, 50);
    })

    
    this.actived.queryParams.subscribe((resp:any) => {
      console.log(resp);
      this.search = resp.search;
      this.listCourses();
      // console.log(this.search);
    })
  }

  addOption(value:number){
    this.selected_option = value;
    if(value == 2){
      setTimeout(() => {
        // filterClickButton();
        $('#slider-range').slider({
          range: true,
          min: 10,
          max: 500,
          values: [0, 100],
          slide: (event:any, ui:any) => {
            // console.log(ui.values[0],ui.values[1]);
              $('#amount').val('$' + ui.values[0] + ' - $' + ui.values[1]);
              this.min_price = ui.values[0];
              this.max_price = ui.values[1];
          },
          stop: () => {
            this.listCourses();
          },
        });
  
        $('#amount').val('$' + $('#slider-range').slider('values', 0) +
            " - $" + $('#slider-range').slider('values', 1));
      }, 50);
    }
  }

  listCourses(){
    console.log(this.search);
    let data = {
      search: this.search,
      selected_categories: this.selected_categories,
      instructores_selected: this.instructores_selected,
      min_price: this.min_price,
      max_price: this.max_price,
      idiomas_selected: this.idiomas_selected,
      levels_selected: this.levels_selected,
      rating_selected: this.rating_selected,
    }
    this.tiendaGuestService.listCourses(data).subscribe((resp:any) => {
      console.log(resp);
      this.LISTCOURSES = resp.courses.data;
    })
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

  addCart(LANDING_COURSE:any,DESCOUNT_CAMPAING:any = null){
    if(!this.user){
      alertWarning("NECESITAS REGISTRARTE EN LA TIENDA");
      this.router.navigateByUrl("auth/login");
      return;
    }
    if(DESCOUNT_CAMPAING){
      LANDING_COURSE.discount_g = DESCOUNT_CAMPAING
    }
    let data = {
      course_id: LANDING_COURSE.id,
      type_discount: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.type_discount : null,
      discount: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.discount : null,
      type_campaing: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.type_campaing : null,
      code_cupon: null,
      code_discount: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.code : null,
      precio_unitario: LANDING_COURSE.precio_usd,
      total: this.getTotalPriceCourse(LANDING_COURSE),
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

  addCategorie(ID_CATEGORIE:any){
    let INDEX = this.selected_categories.findIndex((item:any) => ID_CATEGORIE == item);
    if(INDEX != -1){
      this.selected_categories.splice(INDEX,1);
    }else{
      this.selected_categories.push(ID_CATEGORIE);
    }
    // console.log(this.selected_categories);
    this.listCourses();
  }
  addInstructores(INSTRUCT:any){
    let INDEX = this.instructores_selected.findIndex((item:any) => INSTRUCT.id == item);
    if(INDEX != -1){
      this.instructores_selected.splice(INDEX,1);
    }else{
      this.instructores_selected.push(INSTRUCT.id);
    }
    this.listCourses();
  }

  addIdiomas(IDIOMA:any){
    let INDEX = this.idiomas_selected.findIndex((item:any) => IDIOMA == item);
    if(INDEX != -1){
      this.idiomas_selected.splice(INDEX,1);
    }else{
      this.idiomas_selected.push(IDIOMA);
    }
    this.listCourses();
  }

  addLevels(LEVELE:any){
    let INDEX = this.levels_selected.findIndex((item:any) => LEVELE == item);
    if(INDEX != -1){
      this.levels_selected.splice(INDEX,1);
    }else{
      this.levels_selected.push(LEVELE);
    }
    this.listCourses();
  }

  selectedRating(value:number){
    this.rating_selected = value;
    this.listCourses();
  }
  

}
