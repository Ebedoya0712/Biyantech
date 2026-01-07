import { Component, OnInit } from '@angular/core';
import { CourseService } from '../service/course.service';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-course-trailer',
  templateUrl: './course-trailer.component.html',
  styleUrls: ['./course-trailer.component.scss']
})
export class CourseTrailerComponent implements OnInit {

  isLoading: any;
  FILE_PORTADA: any = null;
  IMAGEN_PREVISUALIZA: any = null;

  title: string = '';
  subtitle: string = '';
  description: string = '';
  vimeo_id: string = '';
  link_video: string = '';
  
  video_file: any = null;

  constructor(
    public courseService: CourseService,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.courseService.isLoading$;
    this.courseService.getTrailer().subscribe((resp: any) => {
      if (resp.trailer) {
        this.title = resp.trailer.title;
        this.subtitle = resp.trailer.subtitle;
        this.description = resp.trailer.description;
        this.vimeo_id = resp.trailer.vimeo_id;
        this.link_video = resp.trailer.link_video;
        this.IMAGEN_PREVISUALIZA = resp.trailer.imagen;
      }
    });
  }

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toaster.open({ text: 'SOLAMENTE SE ACEPTAN IMAGENES', caption: 'MENSAJE DE VALIDACIÓN', type: 'danger' })
      return;
    }
    this.FILE_PORTADA = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_PORTADA);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
  }

  processVideo($event: any) {
    if ($event.target.files[0].type.indexOf("video") < 0) {
      this.toaster.open({ text: 'SOLAMENTE SE ACEPTAN VIDEOS', caption: 'MENSAJE DE VALIDACIÓN', type: 'danger' })
      return;
    }
    this.video_file = $event.target.files[0];
  }

  uploadVideo() {
    if (!this.video_file) {
      this.toaster.open({ text: 'NECESITAS SELECCIONAR UN VIDEO', caption: 'VALIDACION', type: 'danger' });
      return;
    }
    let formData = new FormData();
    formData.append("video", this.video_file);
    this.courseService.uploadVideoTrailer(formData).subscribe((resp: any) => {
      this.toaster.open({ text: 'EL VIDEO SE HA SUBIDO CON EXITO', caption: 'SUCCESS', type: 'primary' });
      this.link_video = resp.link_video;
    });
  }

  save() {
    if (!this.title) {
      this.toaster.open({ text: "EL TITULO ES OBLIGATORIO", caption: 'VALIDACION', type: 'danger' });
      return;
    }
    let formData = new FormData();
    formData.append("title", this.title);
    formData.append("subtitle", this.subtitle);
    formData.append("description", this.description);
    if (this.FILE_PORTADA) {
      formData.append("portada", this.FILE_PORTADA);
    }

    this.courseService.saveTrailer(formData).subscribe((resp: any) => {
      this.toaster.open({ text: "EL TRAILER SE HA GUARDADO CON EXITO", caption: 'SUCCESS', type: 'primary' });
    });
  }
}
