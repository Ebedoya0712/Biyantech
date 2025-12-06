import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(
        private http: HttpClient,
        public authService: AuthService
    ) { }

    getDataDashboard(): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + this.authService.token
        });
        return this.http.get(`${environment.URL_SERVICIOS}/dashboard/admin`, { headers: headers });
    }
}
