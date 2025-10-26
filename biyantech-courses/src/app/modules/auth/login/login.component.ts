import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

declare function _clickDoc():any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Variable de control para alternar entre Login (true) y Register (false)
  isLoginView: boolean = true; 

  // auth-login
  email:any = null;
  password:any = null;

  // auth-register
  email_register:any = null;
  password_register:any = null;
  name: any = null;
  surname: any = null;
  password_confirmation: any = null;
  
  constructor(
    public authService: AuthService,
    public router: Router,
  ){}

  ngOnInit(): void {
    // Lógica existente de inicialización y redirección
    setTimeout(() =>{
      _clickDoc();
    }, 50);

    if(this.authService.user){
        this.router.navigateByUrl("/");
        return;
    }
  }

  // Nueva función para alternar la vista (Login <-> Register)
  toggleView() {
    this.isLoginView = !this.isLoginView;
    
    // Opcional: Limpiar los campos cuando se cambia de vista
    if(this.isLoginView) {
      this.clearRegisterFields();
    } else {
      this.clearLoginFields();
    }
  }

  // Función de limpieza para los campos de Login
  clearLoginFields() {
    this.email = null;
    this.password = null;
  }

  // Función de limpieza para los campos de Register
  clearRegisterFields() {
    this.email_register = null;
    this.name = null;
    this.surname = null;
    this.password_register = null;
    this.password_confirmation = null;
  }

  login(){
    if(!this.email || !this.password){
      alert("NECESITAS INGRESAR TODOS LOS CAMPOS");
      return;
    }
    this.authService.login(this.email,this.password).subscribe((resp:any) => {
      console.log(resp);
      if(resp){
        window.location.reload();
      }else{
        alert("LAS CREDENCIALES NO EXISTEN");
      }
    })
  }

  register(){
    if(!this.email_register || !this.name || !this.surname || !this.password_register || !this.password_confirmation){
      alert("TODOS LOS CAMPOS SON NECESARIOS");
      return;
    }
    if(this.password_register != this.password_confirmation){
      alert("LAS CONTRASEÑAS SON DIFERENTES");
      return;
    }
    let data = {
      email: this.email_register,
      name: this.name,
      surname: this.surname,
      password: this.password_register,
    }
    this.authService.register(data).subscribe((resp:any) => {
      console.log(resp);
      alert("EL USUARIO SE HA REGISTRADO CORRECTAMENTE");
      
      // Tras el registro exitoso, puedes cambiar automáticamente a la vista de Login
      this.toggleView(); // Mueve a la vista de Login
      this.email = data.email; // Pre-llena el email en el formulario de Login
      this.password = null; // Mantiene el campo de contraseña vacío para que inicie sesión
      
    }, error => {
      alert("LAS CREDENCIALES INGRESADAS NO SON CORRECTAS O YA EXISTEN");
      console.log(error);
    })
  }
}