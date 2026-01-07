import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TiendaAuthService } from '../service/tienda-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

declare var Vimeo: any;

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
  safeUrl: any = null;
  percentage_course:number = 0;
  clases_completed:any = [];

  show_next_overlay: boolean = false;
  next_clase: any = null;
  countdown: number = 12;
  interval_countdown: any = null;

  vimeo_player: any = null;

  constructor(
    public tiendaAuthService: TiendaAuthService,
    public activedRoute: ActivatedRoute,
    public router: Router,
    public Sanitizer: DomSanitizer,
  ) {}

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
      this.clases_completed = resp.clases_completed || [];

      this.clase_selected = this.courses_selected.malla[0].clases[0];
      this.urlVideo(this.clase_selected); // Sanitizar URL inicial

      this.calculateProgress();
    })

  }

  ngAfterViewInit(): void {
    this.initVimeoPlayer();
  }

  initVimeoPlayer(){
    setTimeout(() => {
      const iframe = document.querySelector('iframe');
      if (iframe && typeof Vimeo !== 'undefined') {
        // Inicializar SDK para eventos
        this.vimeo_player = new Vimeo.Player(iframe);

        this.vimeo_player.on('ended', () => {
          console.log('Video finalizado logic');
          // Si no está completada, marcar como completada
          if(!this.isCompleted(this.clase_selected.id)){
            this.onToggleClase(this.clase_selected);
          }else{
            // Si ya estaba completada, solo sugerir la siguiente
            this.triggerNextClase();
          }
        });
      }
    }, 1000); 
  }

  calculateProgress(){
    let total_clases = 0;
    let completed_clases = this.clases_completed.length;
    this.courses_selected.malla.forEach((section:any) => {
      total_clases += section.clases.length;
    });

    this.percentage_course = (total_clases > 0) ? Math.round((completed_clases / total_clases) * 100) : 0;
  }

  urlVideo(clase_selected:any){
    this.safeUrl = this.Sanitizer.bypassSecurityTrustResourceUrl(clase_selected.vimeo);
    // Reinicializar listener si ya existe el player
    this.initVimeoPlayer();
  }

  openClase(clase:any){
    this.clase_selected = clase;
    this.urlVideo(this.clase_selected);
    this.cancelNextClase(); // Si cambia manualmente, cancelar auto-avance
  }

  isCompleted(clase_id:any): boolean {
    return this.clases_completed.some((id:any) => id == clase_id);
  }

  onToggleClase(clase:any){
    let data = {
      course_id: this.courses_selected.id,
      clase_id: clase.id
    }
    
    let is_was_completed = this.isCompleted(clase.id);

    // Optimistic Update
    if(is_was_completed){
      this.clases_completed = this.clases_completed.filter((id:any) => id != clase.id);
    }else{
      this.clases_completed.push(clase.id);
    }
    this.calculateProgress();

    this.tiendaAuthService.updateClaseStatus(data).subscribe((resp:any) => {
      console.log(resp);
      this.clases_completed = resp.clases_checkeds; 
      this.calculateProgress();

      // Si se acaba de marcar como completada la clase actual, sugerir la siguiente
      if(!is_was_completed && clase.id == this.clase_selected.id){
        this.triggerNextClase();
      }
    });
  }

  triggerNextClase(){
    this.next_clase = this.getNextClase();
    if(this.next_clase){
      this.show_next_overlay = true;
      this.countdown = 12;
      if(this.interval_countdown) clearInterval(this.interval_countdown);

      this.interval_countdown = setInterval(() => {
        this.countdown--;
        if(this.countdown <= 0){
          clearInterval(this.interval_countdown);
          this.goToNextClase();
        }
      }, 1000);
    }
  }

  cancelNextClase(){
    this.show_next_overlay = false;
    if(this.interval_countdown) clearInterval(this.interval_countdown);
  }

  goToNextClase(){
    if(this.next_clase){
      this.openClase(this.next_clase);
      this.show_next_overlay = false;
    }
  }

  getNextClase() {
    let current_section_index = -1;
    let current_clase_index = -1;

    // Localizar posición actual
    for (let i = 0; i < this.courses_selected.malla.length; i++) {
      let section = this.courses_selected.malla[i];
      let foundIndex = section.clases.findIndex((c: any) => c.id == this.clase_selected.id);
      if (foundIndex !== -1) {
        current_section_index = i;
        current_clase_index = foundIndex;
        break;
      }
    }

    if (current_section_index !== -1) {
      // Intentar siguiente clase en la misma sección
      if (current_clase_index + 1 < this.courses_selected.malla[current_section_index].clases.length) {
        return this.courses_selected.malla[current_section_index].clases[current_clase_index + 1];
      } else {
        // Intentar primera clase de la siguiente sección
        if (current_section_index + 1 < this.courses_selected.malla.length) {
          return this.courses_selected.malla[current_section_index + 1].clases[0];
        }
      }
    }
    return null;
  }
}
