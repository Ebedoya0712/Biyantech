import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategorieService } from '../service/categorie.service';
import { Toaster } from 'ngx-toast-notifications';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-categorie-add',
  templateUrl: './categorie-add.component.html',
  styleUrls: ['./categorie-add.component.scss']
})
export class CategorieAddComponent implements OnInit {

  @Output() CategorieC: EventEmitter<any> = new EventEmitter();
  
    name:any = null; 

    IMAGEN_PREVISUALIZA:any = "./assets/media/avatars/300-6.jpg";
    FILE_PORTADA: any = null;
    isLoading: any;
  
    constructor(
      public categorieService: CategorieService,
      public toaster:Toaster,
      public modal: NgbActiveModal,
    ) { }
  
    ngOnInit(): void {
      this.isLoading = this.categorieService.isLoading$;
    }
      processAvatar($event:any){
          if($event.target.files[0].type.indexOf("image") < 0){
              this.toaster.open({text: 'SOLAMENTE SE ACEPTAN IMAGENES', caption: 'MENSAJE DE VALIDACION', type: 'danger'})
              return;
          }
  
        this.FILE_PORTADA = $event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(this.FILE_PORTADA);
        reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
      }
  
      store(){
  
        if(!this.name ||  !this.FILE_PORTADA){
          this.toaster.open({text: "NECESITAS LLENAR TODOS LOS CAMPOS", caption: 'VALIDACION', type:"danger"});
          return;
        }
  
        let formData = new FormData();
  
        formData.append("name",this.name);
        formData.append("portada",this.FILE_PORTADA);
  
        this.categorieService.registerCategorie(formData).subscribe((resp:any) =>{
          //console.log(resp);
          this.CategorieC.emit(resp.categorie);
          this.toaster.open({text: "LA CATEGORIA SE REGISTRO CORRECTAMENTE", caption: "INFORME", type: 'primary'});
          this.modal.close();
        })
      }

}
