import { Component, OnInit } from '@angular/core'; 
import * as AOS from 'aos'; 
import { timeout } from 'rxjs';

// Declaramos la función global alertSuccess si se usa externamente
declare function alertSuccess([]):any; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { // Implementamos OnInit
  title = 'biyantech-courses';

  // Usar ngOnInit para inicializar AOS y leer el mensaje de persistencia
  ngOnInit() {
    // 1. Inicialización de AOS
    AOS.init({
      duration: 1200,
      once: true
    });

    // 2. Lógica para leer y mostrar la alerta persistente después de la recarga
    this.checkPersistentAlert();
  }

  /**
   * Verifica si hay un mensaje de éxito guardado en sessionStorage (después del checkout)
   * Lo muestra y lo elimina.
   */
  checkPersistentAlert() {
    // Usamos 'checkoutSuccessMessage' como clave, definida en el componente de carrito
    const message = sessionStorage.getItem('checkoutSuccessMessage');

    if (message) {
      // Mostrar la alerta con la función global
      if (typeof alertSuccess === 'function') {
        alertSuccess(message);
      } else {
        // Fallback si la función global no está disponible
        console.log('Alerta de éxito persistente:', message);
      }
      
      // Limpiar el storage inmediatamente para que no se muestre de nuevo en futuras cargas
      sessionStorage.removeItem('checkoutSuccessMessage');
    }
  }
}