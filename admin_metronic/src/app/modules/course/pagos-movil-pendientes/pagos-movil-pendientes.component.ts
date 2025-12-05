import { Component, OnInit } from '@angular/core';
import { CourseService } from '../service/course.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// Declaración de funciones globales de alerta
declare function confirm(message: string): boolean;

@Component({
    selector: 'app-pagos-movil-pendientes',
    templateUrl: './pagos-movil-pendientes.component.html',
    styleUrls: ['./pagos-movil-pendientes.component.scss']
})
export class PagosMovilPendientesComponent implements OnInit {

    PAGOS_PENDIENTES: any[] = [];
    totalItems: number = 0;

    // VARIABLES DE PAGINACIÓN AGREGADAS/ACTUALIZADAS
    page: number = 1; // Página actual
    lastPage: number = 1; // Última página

    // Usamos el observable del servicio para el spinner de carga en el HTML
    isLoading: Observable<boolean>;

    // Variables de búsqueda
    search: string = '';
    state: any = null;

    constructor(
        private courseService: CourseService,
        private router: Router
    ) {
        // Obtenemos el observable de carga del servicio
        this.isLoading = this.courseService.isLoading$;
    }

    ngOnInit(): void {
        // Cargamos la lista inicial al iniciar el componente
        this.listPagos();
    }

    /**
     * Carga la lista de pagos móviles pendientes de aprobación desde la API.
     */
    listPagos() {
        // Se incluye el parámetro 'page' en la llamada
        this.courseService.listPagosMovilPendientes(this.search, this.state, this.page)
            .subscribe((resp: any) => {
                // Se asume la estructura paginada: { data: [/* items */], links: {...}, meta: { current_page, last_page, total, ...} }
                if (resp.data && resp.meta) {
                    // Estructura correcta para ResourceCollection + Paginación
                    this.PAGOS_PENDIENTES = resp.data;
                    this.totalItems = resp.meta.total || resp.data.length;
                    this.page = resp.meta.current_page; // Actualiza la página actual
                    this.lastPage = resp.meta.last_page; // Actualiza la última página
                } else if (resp.data && resp.data.data) {
                    // Estructura anidada doble (manejo secundario)
                    this.PAGOS_PENDIENTES = resp.data.data;
                    this.totalItems = resp.data.meta?.total || resp.data.data.length;
                    this.page = resp.data.meta?.current_page || 1;
                    this.lastPage = resp.data.meta?.last_page || 1;
                } else {
                    // Caso sin datos
                    this.PAGOS_PENDIENTES = [];
                    this.totalItems = 0;
                    this.page = 1;
                    this.lastPage = 1;
                }
            }, (error: any) => {
                console.error("Error al cargar pagos:", error);
                alert("Error al cargar los pagos pendientes.");
            });
    }

    /**
     * Navega a una página específica y recarga la lista.
     * @param newPage Número de página al que navegar.
     */
    goToPage(newPage: number) {
        if (newPage >= 1 && newPage <= this.lastPage) {
            this.page = newPage;
            this.listPagos();
        }
    }

    /**
    * Aprueba un pago móvil: Llama a la API para cambiar status_pgmovil a 1 y dar acceso al curso.
    */
    approvePayment(pago: any) {
        // Usamos confirm() para una confirmación rápida
        if (!confirm(`¿Está seguro de aprobar el pago #${pago.id} de ${pago.user?.name || 'Usuario'}? Esta acción dará acceso inmediato a los cursos y se enviará un correo de confirmación.`)) {
            return;
        }

        // Llamamos al método correcto del servicio
        this.courseService.approvePagoMovil(pago.id).subscribe((resp: any) => {

            if (resp.message === 200) {
                alert("¡Pago Aprobado! El usuario ya tiene acceso a sus cursos y se le ha enviado un correo de confirmación.");

                // Recargar la lista después de aprobar
                this.listPagos();

            } else {
                alert(resp.message_text || "Error al aprobar el pago.");
                console.error("Error en respuesta:", resp);
            }
        }, (error: any) => {
            console.error("Error en aprobación:", error);

            // Mostrar mensaje más específico según el error
            if (error.status === 400) {
                alert("Error: " + (error.error?.message_text || "Este pago ya fue aprobado o no es válido."));
            } else if (error.status === 404) {
                alert("Error: No se encontró el pago.");
            } else {
                alert("Error de conexión al intentar aprobar el pago.");
            }
        });
    }

    rejectPayment(pago: any) {
        // Confirmación antes de rechazar
        if (!confirm(`¿Está seguro de RECHAZAR el pago #${pago.id} de ${pago.user?.name || 'Usuario'}? Esta acción eliminará permanentemente el registro de la venta.`)) {
            return;
        }

        // Llamamos al método de rechazo del servicio
        this.courseService.rejectPagoMovil(pago.id).subscribe((resp: any) => {

            if (resp.message === 200) {
                alert("Pago rechazado y eliminado exitosamente.");

                // Recargar la lista después de rechazar
                this.listPagos();

            } else {
                alert(resp.message_text || "Error al rechazar el pago.");
                console.error("Error en respuesta:", resp);
            }
        }, (error: any) => {
            console.error("Error al rechazar:", error);

            // Mostrar mensaje más específico según el error
            if (error.status === 400) {
                alert("Error: " + (error.error?.message_text || "No se puede rechazar este pago."));
            } else if (error.status === 404) {
                alert("Error: No se encontró el pago.");
            } else {
                alert("Error de conexión al intentar rechazar el pago.");
            }
        });
    }
}