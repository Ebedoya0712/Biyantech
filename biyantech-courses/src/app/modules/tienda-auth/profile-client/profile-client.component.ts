import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { TiendaAuthService } from '../service/tienda-auth.service';

declare function alertSuccess([]):any;
declare function alertDanger([]):any;
@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css']
})
export class ProfileClientComponent implements OnInit{

  nav_option:number = 5;

  enrolled_course_count:number = 0;
  active_course_count:number = 0;
  termined_course_count:number = 0;
  user:any = null;

  enrolled_courses:any = [];
  active_courses:any = [];
  termined_courses:any = [];

  sale_details:any = [];
  sale_detail_selected:any = null;
  message:any = null;
  rating:number = 0;

  sales:any = [];
  // 
  sale_selected:any = null;

  name: any = null;
  surname: any = null;
  email: any = null;
  phone: any = null;
  profession: any = null;
  description: any = null;
  password:any = null;
  new_password:any = null;
  file_imagen:any = null;
  constructor(
    public authService: AuthService,
    public tiendaAuth: TiendaAuthService,
  ) {
    
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.tiendaAuth.profileClient().subscribe((resp:any) => {
      console.log(resp);
      this.enrolled_course_count = resp.enrolled_course_count;
      this.active_course_count = resp.active_course_count;
      this.termined_course_count = resp.termined_course_count;
      this.user = resp.user;
      this.name = this.user.name;
      this.surname = this.user.surname;
      this.email = this.user.email;
      this.phone = this.user.phone;
      this.profession = this.user.profesion;
      this.description = this.user.description;

      this.enrolled_courses = resp.enrolled_courses;
      this.active_courses = resp.active_courses;
      this.termined_courses = resp.termined_courses;
      this.sale_details = resp.sale_details;
      this.sales = resp.sales.data;
    })
  }

  navOption(val:number){
    this.nav_option = val;
  }

  logout(){
    this.authService.logout();
  }
  backlist(){
    this.sale_detail_selected = null;
    this.rating = 0;
    this.message = null;
  }
  openReview(sale_detail:any){
    this.sale_detail_selected = sale_detail;
    if(this.sale_detail_selected.review){
      this.rating = this.sale_detail_selected.review.rating;
      this.message = this.sale_detail_selected.review.message;
    }
  }

  selectedRating(rating:number){
    this.rating = rating;
  }

  saveReview(){
    if(!this.message || !this.rating){
      alertDanger("LA CALIFICACIÓN Y EL MENSAJE SON OBLIGATORIOS");
      return;
    }
    let data = {
      course_id: this.sale_detail_selected.course.id,
      sale_detail_id: this.sale_detail_selected.id,
      message: this.message,
      rating: this.rating,
    };
    if(this.sale_detail_selected.review){
      this.tiendaAuth.updateReview(data,this.sale_detail_selected.review.id).subscribe((resp:any) => {
        console.log(resp);
        alertSuccess("LA RESEÑA SE EDITO CORRECTAMENTE");
        let INDEX = this.sale_details.findIndex((item:any) => item.id == this.sale_detail_selected.id);
        if(INDEX != -1){
          this.sale_details[INDEX].review = resp.review;
        }
      })
    }else{
      this.tiendaAuth.registerReview(data).subscribe((resp:any) => {
        console.log(resp);
        alertSuccess("LA RESEÑA SE REGISTRO CORRECTAMENTE");
        let INDEX = this.sale_details.findIndex((item:any) => item.id == this.sale_detail_selected.id);
        if(INDEX != -1){
          this.sale_details[INDEX].review = resp.review;
        }
      })
    }
  }

  getNameCampaing(type:number){
    let Name = "";
    switch (type) {
      case 1:
        Name = "CAMPAÑA NORMAL"
        break;
      case 2:
        Name = "CAMPAÑA FLASH"
        break;
      case 3:
        Name = "CAMPAÑA BANNER"
        break;
    
      default:
        break;
    }

    return Name;
  }

  selectedSale(sale:any){
    this.sale_selected = sale;
  }

  updateUser(){
    if(this.password || this.new_password){
      if(this.password != this.new_password){
        alertDanger("LAS CONTTRASEÑAS NO SON IGUALES");
        return;
      }
    }
    // let data = {
    //   name: this.name,
    //   surname: this.surname,
    //   email: this.email,
    //   phone: this.phone,
    //   profesion: this.profession,
    //   description: this.description,
    //   new_password: this.new_password,
    // };
    let formData = new FormData();
    if(this.file_imagen){
      formData.append("imagen",this.file_imagen);
    }
    formData.append("name",this.name);
    formData.append("surname",this.surname);
    formData.append("email",this.email);
    formData.append("phone",this.phone);
    formData.append("profession",this.profession);
    formData.append("description",this.description);
    if(this.new_password){
      formData.append("new_password",this.new_password);
    }
    this.tiendaAuth.updateUser(formData).subscribe((resp:any) => {
      console.log(resp);
      alertSuccess("LOS REGISTRO SE ACTUALIZARON CORRECTAMENTE");
    })
  }

  processFile($event:any){
    this.file_imagen = $event.target.files[0];
  }
}
