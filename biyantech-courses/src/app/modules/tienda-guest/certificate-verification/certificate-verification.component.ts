import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TiendaGuestService } from '../service/tienda-guest.service'; // Path corregido

@Component({
  selector: 'app-certificate-verification',
  templateUrl: './certificate-verification.component.html',
  styleUrls: ['./certificate-verification.component.css']
})
export class CertificateVerificationComponent implements OnInit {

  code: string = '';
  verificationResult: any = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    public tiendaGuestService: TiendaGuestService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.code = params['code'];
      this.verify();
    });
  }

  verify() {
    this.loading = true;
    this.tiendaGuestService.verifyCertificate(this.code).subscribe((resp: any) => {
      console.log(resp);
      this.loading = false;
      if (resp.valid) {
        this.verificationResult = resp;
      } else {
        this.error = "Certificado no válido o no encontrado.";
      }
    }, (err: any) => { // Tipo explícito añadido
      this.loading = false;
      this.error = "No se pudo verificar el certificado. Código incorrecto.";
    });
  }
}
