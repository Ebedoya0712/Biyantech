import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { UserService } from '../service/user.service';
import { Observable } from 'rxjs'; // Necesario para isLoading$

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  @Output() UserC: EventEmitter<any> = new EventEmitter();

  // Propiedades del formulario (Tipos de datos definidos)
  name: string = ''; 
  surname: string = '';
  email: string = '';
  password: string = '';
  confirmation_password: string = '';
  
  // Nuevas propiedades de Edición/Roles/Instructor
  state: number = 1; // 1: Activo por defecto
  is_instructor: boolean = false;
  profesion: string = '';
  description: string = '';
  role_id: number | null = null; // Asignación de rol
  roles: any[] = []; // Lista para cargar roles
  
  // Archivos e Imágenes
  IMAGEN_PREVISUALIZA: string = "./assets/media/avatars/300-6.jpg";
  FILE_AVATAR: File | null = null; // Usar tipo File
  isLoading: Observable<boolean>; // Usar Observable

  constructor(
    public userService: UserService,
    public toaster: Toaster,
    public modal: NgbActiveModal,
  ) {
    this.isLoading = this.userService.isLoading$;
  }

  ngOnInit(): void {
    // Cargar los roles al iniciar el componente
    this.loadRoles();
  }
  
  // --- LÓGICA DE ROLES (Copiada de UserEditComponent) ---
  loadRoles(): void {
    this.userService.getRoles().subscribe(
      (resp: any) => {
        if (resp.success) {
          this.roles = resp.roles;
          // Si es un nuevo usuario, se podría preseleccionar un rol por defecto si es necesario
          // this.role_id = resp.roles.find((r:any) => r.name === 'Usuario')?.id || null;
        } else {
          // Fallback roles en caso de fallo de API
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

  // --- LÓGICA DE AVATAR (Mejorada con la validación de UserEditComponent) ---
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
  
  // --- LÓGICA DE INSTRUCTOR ---
  isInstructor(): void {
    this.is_instructor = !this.is_instructor;
    if (!this.is_instructor) {
      this.profesion = '';
      this.description = '';
    }
  }

  // --- VALIDACIÓN UNIFICADA (Combinando validaciones de los pasos 1 y 2) ---
  validateForm(): boolean {
    // Validación de campos obligatorios (nombre, apellido, email, contraseña, avatar, rol)
    if (!this.name?.trim() || !this.surname?.trim() || !this.email?.trim() || !this.password || !this.confirmation_password || !this.FILE_AVATAR) {
        this.toaster.open({ text: "NECESITAS LLENAR TODOS LOS CAMPOS OBLIGATORIOS", caption: 'VALIDACION', type: "danger" });
        return false;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
        this.toaster.open({ text: 'Por favor ingresa un email válido', caption: 'Validación', type: 'danger' });
        return false;
    }

    // Validación de rol (obligatorio para registro)
    if (!this.role_id) {
        this.toaster.open({ text: 'Por favor selecciona un rol para el usuario', caption: 'Validación', type: 'danger' });
        return false;
    }

    // Validación de longitud de contraseña
    if (this.password.length < 8) {
        this.toaster.open({ text: 'La contraseña debe tener al menos 8 caracteres', caption: 'Validación', type: 'danger' });
        return false;
    }

    // Validación de coincidencia de contraseñas
    if (this.password !== this.confirmation_password) {
        this.toaster.open({ text: "LAS CONTRASEÑAS NO COINCIDEN", caption: 'VALIDACION', type: "danger" });
        return false;
    }

    return true;
  }

  // --- FUNCIÓN STORE MODIFICADA ---
  store(): void {
    if (!this.validateForm()) {
      return;
    }

    const formData = new FormData();

    // Datos principales
    formData.append("name", this.name);
    formData.append("surname", this.surname);
    formData.append("email", this.email);
    formData.append("password", this.password);
    formData.append("state", this.state.toString());
    
    // Roles y tipos (Asumiendo que 'type_user' 2 es un tipo general para el frontend)
    if (this.role_id !== null) {
      formData.append("role_id", this.role_id.toString());
    } else {
      // Fallback seguro si role_id sigue siendo null (aunque la validación lo debería haber capturado)
      formData.append("role_id", "3"); // Ejemplo: Asignar 'Usuario' por defecto
    }
    
    formData.append("type_user", "2"); // Mantenemos tu campo type_user
    
    // Datos de instructor (opcionales)
    formData.append('is_instructor', this.is_instructor ? '1' : '0');
    if (this.is_instructor) {
      if (this.profesion) formData.append('profesion', this.profesion);
      if (this.description) formData.append('description', this.description);
    }
    
    // Imagen
    if (this.FILE_AVATAR) {
        formData.append("imagen", this.FILE_AVATAR);
    }


    this.userService.register(formData).subscribe({
        next: (resp: any) => {
            if (resp.success) {
                this.UserC.emit(resp.user);
                this.toaster.open({ text: "EL USUARIO SE REGISTRÓ CORRECTAMENTE", caption: "INFORME", type: 'success' });
                this.modal.close();
            } else {
                 this.toaster.open({ text: resp.message || 'Error al registrar el usuario', caption: 'ERROR', type: 'danger' });
            }
        },
        error: (error: any) => {
            console.error('Error:', error);
            this.toaster.open({ text: "Error del servidor al registrar usuario", caption: 'ERROR', type: 'danger' });
        }
    });
  }
}