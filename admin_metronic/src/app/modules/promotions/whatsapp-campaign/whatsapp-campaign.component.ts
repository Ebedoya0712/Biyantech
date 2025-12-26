import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Component({
    selector: 'app-whatsapp-campaign',
    templateUrl: './whatsapp-campaign.component.html',
    styleUrls: ['./whatsapp-campaign.component.scss']
})
export class WhatsappCampaignComponent implements OnInit {

    message: string = '';
    isLoading: boolean = false;

    constructor(public http: HttpClient) { }

    ngOnInit(): void {
    }

    send() {
        if (!this.message) {
            alert("Por favor ingrese el mensaje de la campaña.");
            return;
        }

        this.isLoading = true;
        let data = {
            message: this.message
        };

        this.http.post(URL_SERVICIOS + '/marketing/whatsapp-campaign', data).subscribe((resp: any) => {
            console.log(resp);
            this.isLoading = false;
            alert("Campaña de Whatsapp enviada correctamente a " + resp.students_count + " estudiantes (Simulación).");
            this.message = '';
        }, (error) => {
            console.error(error);
            this.isLoading = false;
            alert("Hubo un error al enviar la campaña.");
        });
    }
}
