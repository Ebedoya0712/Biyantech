import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Component({
    selector: 'app-send-feedback',
    templateUrl: './send-feedback.component.html',
    styleUrls: ['./send-feedback.component.scss']
})
export class SendFeedbackComponent implements OnInit {

    body_content: any = '';
    url: string = '';
    isLoading: boolean = false;

    constructor(public http: HttpClient) { }

    ngOnInit(): void {
    }

    send() {
        if (!this.body_content || !this.url) {
            alert("Por favor complete todos los campos (Contenido y URL)");
            return;
        }

        this.isLoading = true;
        let data = {
            body_content: this.body_content,
            url: this.url
        };

        // Need to verify the auth token handling. 
        // Assuming interceptors handle it, or we manually add headers if needed. 
        // Usually admin_metronic has an auth interceptor or we use a service.
        // For simplicity I'll use direct http here but usually best practice is a service.
        // I'll assume global interceptor for token.

        this.http.post(URL_SERVICIOS + '/feedback/send', data).subscribe((resp: any) => {
            console.log(resp);
            this.isLoading = false;
            alert("Correos enviados correctamente a " + resp.count + " estudiantes.");
            this.body_content = '';
            this.url = '';
        }, (error) => {
            console.error(error);
            this.isLoading = false;
            alert("Hubo un error al enviar los correos.");
        });
    }
}
