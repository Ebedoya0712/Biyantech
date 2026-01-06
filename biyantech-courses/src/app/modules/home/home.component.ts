import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HomeService } from './services/home.service';
import { CartService } from '../tienda-guest/service/cart.service';
import { Router } from '@angular/router';

declare var $: any;
declare function HOMEINIT([]): any;
declare function banner_home(): any;
declare function countdownT(): any;
declare function alertWarning([]): any;
declare function alertDanger([]): any;
declare function alertSuccess([]): any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit { // Implementamos AfterViewInit

  // Variables para la animación Scroll Reveal
  @ViewChild('bannerArea') bannerArea!: ElementRef; // Referencia al div HTML
  isBannerVisible: boolean = false; // Propiedad para el estado de la animación

  CATEGORIES: any = [];
  COURSES_HOME: any = [];
  group_courses_categories: any = [];
  DESCOUNT_BANNER: any = null;
  DESCOUNT_BANNER_COURSES: any = [];

  DESCOUNT_FLASH: any = null; // Variable clave para el error
  DESCOUNT_FLASH_COURSES: any = [];
  user: any = null;
  TRAILER: any = null;

  // Lógica del Typewriter Effect
  typewriterText: string = '';
  private phrases: string[] = [
    'Tu educación integral para el futuro.',
    'Transforma tu talento en éxito profesional.',
    'Aumenta tus ingresos con educación de alto impacto.',
    'Domina las habilidades que las empresas buscan hoy.',
    'Tu camino hacia el liderazgo empieza aquí.',
    'Construye el futuro tecnológico que siempre soñaste.',
    'Aprende de los mejores y sé el mejor en tu campo.'
  ];
  private currentPhraseIndex: number = 0;
  private isDeleting: boolean = false;
  private typingSpeed: number = 100;

  constructor(
    public homeService: HomeService,
    public cartService: CartService,
    public router: Router,
  ) {
    // setTimeout(() => {
    //   HOMEINIT($);
    // }, 50);
  }

  ngOnInit(): void {
    this.startTypewriter();
    this.homeService.home().subscribe((resp: any) => {
      console.log(resp);
      this.CATEGORIES = resp.categories;
      this.COURSES_HOME = resp.courses_home.data;
      this.group_courses_categories = resp.group_courses_categories;
      this.DESCOUNT_BANNER = resp.DESCOUNT_BANNER;
      this.DESCOUNT_BANNER_COURSES = resp.DESCOUNT_BANNER_COURSES;
      this.DESCOUNT_FLASH = resp.DESCOUNT_FLASH;
      this.DESCOUNT_FLASH_COURSES = resp.DESCOUNT_FLASH_COURSES;

      setTimeout(() => {
        // 🚨 CORRECCIÓN DE ERROR DE COUNTDOWN: Validamos la existencia del descuento flash
        if (this.DESCOUNT_BANNER) {
          banner_home();
        }

        if (this.DESCOUNT_FLASH) { // 👈 Solo llama a countdownT si existen datos
          countdownT();
        }

        // Llamada a la función del observador
        this.setupIntersectionObserver();
        HOMEINIT($);
      }, 50);
    })

    this.homeService.getTrailer().subscribe((resp: any) => {
      this.TRAILER = resp.trailer;
    })

    this.user = this.cartService.authService.user;
  }

  private startTypewriter(): void {
    const currentPhrase = this.phrases[this.currentPhraseIndex];
    
    if (this.isDeleting) {
      this.typewriterText = currentPhrase.substring(0, this.typewriterText.length - 1);
      this.typingSpeed = 50;
    } else {
      this.typewriterText = currentPhrase.substring(0, this.typewriterText.length + 1);
      this.typingSpeed = 100;
    }

    if (!this.isDeleting && this.typewriterText === currentPhrase) {
      this.isDeleting = true;
      this.typingSpeed = 2000; // Pausa al final de la frase
    } else if (this.isDeleting && this.typewriterText === '') {
      this.isDeleting = false;
      this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
      this.typingSpeed = 500; // Pausa antes de empezar la siguiente
    }

    setTimeout(() => this.startTypewriter(), this.typingSpeed);
  }

  ngAfterViewInit(): void {
    // Si la inicialización del observador estuviera aquí, se podría llamar también.
  }

  // Lógica del Intersection Observer (Detector de Scroll)
  private setupIntersectionObserver(): void {
    setTimeout(() => {
      // Verificamos si la referencia al elemento existe antes de observar
      if (!this.bannerArea) {
        return;
      }

      const options = { root: null, rootMargin: '0px', threshold: 0.1 };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.isBannerVisible = true; // Activa la clase CSS .is-visible
            observer.unobserve(entry.target);
          }
        });
      }, options);

      observer.observe(this.bannerArea.nativeElement);
    }, 100); // Retraso de 100ms para evitar el parpadeo
  }

  /**
   * FUNCIÓN CORREGIDA: Calcula el nuevo precio total con descuento.
   * Se añade Math.round() y toFixed(2) para limitar a dos decimales y evitar 
   * el problema de la precisión de coma flotante (ej: 48.949999999999996).
   */
  getNewTotal(COURSE: any, DESCOUNT_BANNER: any) {
    let newPrice: number;

    if (DESCOUNT_BANNER.type_discount == 1) {
      // Descuento por porcentaje
      newPrice = COURSE.precio_usd - COURSE.precio_usd * (DESCOUNT_BANNER.discount * 0.01);
    } else {
      // Descuento fijo
      newPrice = COURSE.precio_usd - DESCOUNT_BANNER.discount;
    }

    // Redondea el resultado a dos decimales para el formato de precio.
    // toFixed(2) devuelve el resultado como string.
    return (Math.round(newPrice * 100) / 100).toFixed(2);
  }

  getTotalPriceCourse(COURSE: any) {
    if (COURSE.discount_g) {
      return this.getNewTotal(COURSE, COURSE.discount_g);
    }
    // Usar toFixed(2) también aquí para asegurar que el precio sin descuento también tiene dos decimales.
    return COURSE.precio_usd.toFixed(2);
  }

  addCart(LANDING_COURSE: any, DESCOUNT_CAMPAING: any = null) {
    if (!this.user) {
      alertWarning("NECESITAS REGISTRARTE EN LA TIENDA");
      this.router.navigateByUrl("auth/login");
      return;
    }
    if (DESCOUNT_CAMPAING) {
      LANDING_COURSE.discount_g = DESCOUNT_CAMPAING
    }
    let data = {
      course_id: LANDING_COURSE.id,
      type_discount: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.type_discount : null,
      discount: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.discount : null,
      type_campaing: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.type_campaing : null,
      code_cupon: null,
      code_discount: LANDING_COURSE.discount_g ? LANDING_COURSE.discount_g.code : null,
      precio_unitario: LANDING_COURSE.precio_usd,
      total: this.getTotalPriceCourse(LANDING_COURSE),
    };
    this.cartService.registerCart(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        alertDanger(resp.message_text);
        return;
      } else {
        this.cartService.addCart(resp.cart);
        alertSuccess("EL CURSO SE AGREGO AL CARRITO EXITOSAMENTE");
      }
    })
  }

  /**
   * FUNCIÓN AÑADIDA: Desplaza la página al inicio (top: 0) con animación suave.
   */
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}