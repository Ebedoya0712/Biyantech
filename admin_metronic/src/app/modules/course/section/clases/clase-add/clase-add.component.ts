import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clase-add',
  templateUrl: './clase-add.component.html',
  styleUrls: ['./clase-add.component.scss']
})
export class ClaseAddComponent implements OnInit {

  CLASES:any = [];
  isLoading:any;
  title:any;

  description:any = "<p>Descripcion del curso</p>";

  FILES:any = [];



  constructor() { }

  ngOnInit(): void {
  }

  save(){

  }

  public onChange(event: any) {
    this.description = event.editor.getData();
  }

  editClases(CLASE:any){

  }

  deleteClases(CLASE:any){

  }

  processFile($event:any){
    this.FILES = $event.target.files;
    console.log(this.FILES);
    //if($event.target.files[0].type.indexOf("image") < 0){
      //this.toaster.open({text: 'SOLAMENTE SE ACEPTAN IMAGENES', caption:'MENSAJE DE VALIDACIÓN',type: 'danger'})
      //return;
    //}
    //this.FILE_PORTADA = $event.target.files[0];
    //let reader = new FileReader();
    //reader.readAsDataURL(this.FILE_PORTADA);
    //reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
    //this.courseService.isLoadingSubject.next(true);
    //setTimeout(() => {
      //this.courseService.isLoadingSubject.next(false);
    //}, 50);
  }
}
