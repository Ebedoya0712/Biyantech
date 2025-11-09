import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../service/user.service';
import { Toaster } from 'ngx-toast-notifications';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  @Input() user: any;
  @Output() UserE: EventEmitter<any> = new EventEmitter();

  // Form Data
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  confirmation_password: string = '';
  state: number = 1;
  is_instructor: boolean = false;
  profesion: string = '';
  description: string = '';
  role_id: number | null = null;
  
  // Roles
  roles: any[] = [];
  
  // Image
  IMAGEN_PREVISUALIZA: string = "./assets/media/avatars/300-6.jpg";
  FILE_AVATAR: File | null = null;
  
  // Loading & State
  isLoading: Observable<boolean>;
  currentStep: number = 1;

  constructor(
    public userService: UserService,
    public toaster: Toaster,
    public modal: NgbActiveModal,
  ) {
    this.isLoading = this.userService.isLoading$;
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadRoles();
  }

  loadUserData(): void {
    if (this.user) {
      this.name = this.user.name || '';
      this.surname = this.user.surname || '';
      this.email = this.user.email || '';
      this.state = this.user.state || 1;
      this.is_instructor = this.user.is_instructor || false;
      this.profesion = this.user.profesion || '';
      this.description = this.user.description || '';
      this.role_id = this.user.role_id || null;
      this.IMAGEN_PREVISUALIZA = this.user.avatar || "./assets/media/avatars/300-6.jpg";
    }
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe(
      (resp: any) => {
        if (resp.success) {
          this.roles = resp.roles;
        } else {
          // Fallback roles
          this.roles = [
            { id: 1, name: 'Administrador' },
            { id: 2, name: 'Editor' },
            { id: 3, name: 'Usuario' },
            { id: 4, name: 'Instructor' }
          ];
        }
      },
      (error: any) => {
        console.error('Error loading roles:', error);
        // Fallback roles en caso de error
        this.roles = [
          { id: 1, name: 'Administrador' },
          { id: 2, name: 'Editor' },
          { id: 3, name: 'Usuario' },
          { id: 4, name: 'Instructor' }
        ];
      }
    );
  }

  processAvatar(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toaster.open({
        text: 'Solo se permiten archivos de imagen',
        caption: 'Error',
        type: 'danger'
      });
      return;
    }

    this.FILE_AVATAR = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.IMAGEN_PREVISUALIZA = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  nextStep(): void {
    if (this.validateStep1()) {
      this.currentStep = 2;
    }
  }

  previousStep(): void {
    this.currentStep = 1;
  }

  validateStep1(): boolean {
    if (!this.name?.trim() || !this.surname?.trim() || !this.email?.trim()) {
      this.toaster.open({
        text: 'Por favor completa todos los campos obligatorios',
        caption: 'Validación',
        type: 'warning'
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.toaster.open({
        text: 'Por favor ingresa un email válido',
        caption: 'Validación',
        type: 'warning'
      });
      return false;
    }

    return true;
  }

  validateStep2(): boolean {
    if (!this.role_id) {
      this.toaster.open({
        text: 'Por favor selecciona un rol para el usuario',
        caption: 'Validación',
        type: 'warning'
      });
      return false;
    }

    if (this.password && this.password.length < 8) {
      this.toaster.open({
        text: 'La contraseña debe tener al menos 8 caracteres',
        caption: 'Validación',
        type: 'warning'
      });
      return false;
    }

    if (this.password !== this.confirmation_password) {
      this.toaster.open({
        text: 'Las contraseñas no coinciden',
        caption: 'Validación',
        type: 'warning'
      });
      return false;
    }

    return true;
  }

  store(): void {
    if (!this.validateStep2()) {
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('surname', this.surname);
    formData.append('email', this.email);
    formData.append('state', this.state.toString());
    
    if (this.role_id) {
      formData.append('role_id', this.role_id.toString());
    }
    
    formData.append('is_instructor', this.is_instructor ? '1' : '0');
    
    if (this.is_instructor) {
      if (this.profesion) formData.append('profesion', this.profesion);
      if (this.description) formData.append('description', this.description);
    }
    
    if (this.password) {
      formData.append('password', this.password);
    }
    
    if (this.FILE_AVATAR) {
      formData.append('imagen', this.FILE_AVATAR);
    }

    this.userService.update(formData, this.user.id).subscribe(
      (resp: any) => {
        if (resp.success) {
          this.UserE.emit(resp.user);
          this.toaster.open({
            text: 'Usuario actualizado correctamente',
            caption: 'Éxito',
            type: 'success'
          });
          this.modal.close();
        } else {
          this.toaster.open({
            text: resp.message || 'Error al actualizar el usuario',
            caption: 'Error',
            type: 'danger'
          });
        }
      },
      (error: any) => {
        console.error('Error:', error);
        this.toaster.open({
          text: 'Error del servidor al actualizar usuario',
          caption: 'Error',
          type: 'danger'
        });
      }
    );
  }

  isInstructor(): void {
    this.is_instructor = !this.is_instructor;
    if (!this.is_instructor) {
      this.profesion = '';
      this.description = '';
    }
  }
}