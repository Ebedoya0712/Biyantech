import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Component({
    selector: 'app-email-campaign',
    templateUrl: './email-campaign.component.html',
    styleUrls: ['./email-campaign.component.scss']
})
export class EmailCampaignComponent implements OnInit {

    subject: string = '';
    body_content: any = '';
    isLoading: boolean = false;

    constructor(public http: HttpClient) { }

    ngOnInit(): void {
    }

    send() {
        if (!this.subject || !this.body_content) {
            alert("Por favor complete todos los campos (Asunto y Contenido)");
            return;
        }

        this.isLoading = true;
        let data = {
            subject: this.subject,
            body_content: this.body_content
        };

        this.http.post(URL_SERVICIOS + '/marketing/email-campaign', data).subscribe((resp: any) => {
            console.log(resp);
            this.isLoading = false;
            alert("Campaña enviada correctamente a " + resp.students_count + " estudiantes.");
            this.subject = '';
            this.body_content = '';
        }, (error) => {
            console.error(error);
            this.isLoading = false;
            alert("Hubo un error al enviar la campaña.");
        });
    }
}
