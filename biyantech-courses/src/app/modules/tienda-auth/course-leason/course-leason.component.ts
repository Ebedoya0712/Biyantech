import { Component } from '@angular/core';
import { TiendaAuthService } from '../service/tienda-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

declare function alertDanger([]):any;
declare function alertSuccess([]):any;
@Component({
  selector: 'app-course-leason',
  templateUrl: './course-leason.component.html',
  styleUrls: ['./course-leason.component.css']
})
export class CourseLeasonComponent {

  slug:any = null;
  courses_selected:any = null;
  clase_selected:any = null;
  constructor(
    public tiendaAuthService: TiendaAuthService,
    public activedRoute: ActivatedRoute,
    public router: Router,
    public Sanitizer: DomSanitizer,
  ) {
    
  }
  ngOnInit(): void {
    
    this.activedRoute.params.subscribe((resp:any) => {
      console.log(resp);
      this.slug = resp.slug;
    })

    this.tiendaAuthService.showCourse(this.slug).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        alertDanger(resp.message_text);
        this.router.navigateByUrl("/");
      }
      this.courses_selected = resp.course;

      this.clase_selected = this.courses_selected.malla[0].clases[0];
    })

  }

  urlVideo(clase_selected:any){
    return this.Sanitizer.bypassSecurityTrustResourceUrl(clase_selected.vimeo);
  }

  openClase(clase:any){
    this.clase_selected = clase;
  }
}
