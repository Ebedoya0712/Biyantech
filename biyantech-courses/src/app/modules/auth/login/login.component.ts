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

  // Variable de control para alternar entre Login (true), Register (false) o Forgot (extra)
  isLoginView: boolean = true; 
  isForgotPasswordView: boolean = false;

  rememberMe: boolean = false;

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

    const savedEmail = localStorage.getItem("remember_email");
    if(savedEmail){
      this.email = savedEmail;
      this.rememberMe = true;
    }

    if(this.authService.user){
        this.router.navigateByUrl("/");
        return;
    }
  }

  // Nueva función para alternar la vista (Login <-> Register <-> Forgot)
  toggleView(view: 'login' | 'register' | 'forgot') {
    if(view === 'login'){
      this.isLoginView = true;
      this.isForgotPasswordView = false;
      this.clearRegisterFields();
    } else if (view === 'register'){
      this.isLoginView = false;
      this.isForgotPasswordView = false;
      this.clearLoginFields();
    } else if (view === 'forgot'){
      this.isLoginView = false;
      this.isForgotPasswordView = true;
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
        if(this.rememberMe){
          localStorage.setItem("remember_email", this.email);
        } else {
          localStorage.removeItem("remember_email");
        }
        window.location.reload();
      }else{
        alert("LAS CREDENCIALES NO EXISTEN");
      }
    })
  }

  forgotPassword(){
    if(!this.email){
      alert("POR FAVOR INGRESA TU CORREO ELECTRÓNICO");
      return;
    }
    this.authService.forgotPassword(this.email).subscribe((resp:any) => {
      console.log(resp);
      alert(resp.message || "CORREO DE RECUPERACIÓN ENVIADO");
      this.toggleView('login');
    }, error => {
      alert("EL CORREO NO EXISTE O HUBO UN ERROR");
      console.log(error);
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
      this.toggleView('login'); // Mueve a la vista de Login
      this.email = data.email; // Pre-llena el email en el formulario de Login
      this.password = null; // Mantiene el campo de contraseña vacío para que inicie sesión
      
    }, error => {
      alert("LAS CREDENCIALES INGRESADAS NO SON CORRECTAS O YA EXISTEN");
      console.log(error);
    })
  }
}