import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {
  
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    public http: HttpClient,
    public authService: AuthService,
  ) { }

  getFinancialSummary() {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    let URL = URL_SERVICIOS + "/accounting/financial";
    return this.http.get(URL, {headers: headers});
  }

  getRevenueDetails(page: number = 1) {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    let URL = URL_SERVICIOS + "/accounting/revenue?page=" + page;
    return this.http.get(URL, {headers: headers});
  }

  getCostDetails() {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    let URL = URL_SERVICIOS + "/accounting/costs";
    return this.http.get(URL, {headers: headers});
  }

  getDepartmentDetails() {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    let URL = URL_SERVICIOS + "/accounting/departments";
    return this.http.get(URL, {headers: headers});
  }

  registerExpense(data: any) {
    this.isLoading$?.next(true);
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    let URL = URL_SERVICIOS + "/accounting/costs";
    return this.http.post(URL, data, {headers: headers}).pipe(
      // finalize(() => this.isLoading$?.next(false)) // Ideally use finalize
    );
  }
}
