import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Observable } from 'rxjs'; // Asegúrate de importar Observable

@Injectable({
  providedIn: 'root'
})
export class TiendaAuthService {

  constructor(
    public http: HttpClient,
    public authService: AuthService,
  ) { }

  profileClient(){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/profile";
    return this.http.post(URL,{},{headers: headers});
  }

  registerReview(data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/review";
    return this.http.post(URL,data,{headers: headers});
  }

  updateReview(data:any,review_id:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/review/"+review_id;
    return this.http.put(URL,data,{headers: headers});
  }

  updateUser(data:any){
    let headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});
    let URL = URL_SERVICIOS+"/ecommerce/update_client";
    return this.http.post(URL,data,{headers: headers});
  }

  // --- AÑADE ESTE NUEVO MÉTODO ---
  downloadCertificate(courseStudentId: number): Observable<Blob> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.token});
    const URL = `${URL_SERVICIOS}/ecommerce/download-certificate/${courseStudentId}`;
    return this.http.get(URL, { headers: headers, responseType: 'blob' });
  }

  landingCourse(slug:string,campaing_discount:any = null){
    let headers = new HttpHeaders({"Authorization": "Bearer "+this.authService.token});
    let LINK = "";
    if(campaing_discount){
      LINK = LINK + "?campaing_discount="+campaing_discount;
    }
    let URL = URL_SERVICIOS+"/ecommerce/course-detail/"+slug+LINK;
    return this.http.get(URL,{headers: headers});
  }

  listCourses(data:any){
    let URL = URL_SERVICIOS+"/ecommerce/list_courses";
    return this.http.post(URL,data);
  }

  listConfig(){
    let URL = URL_SERVICIOS+"/ecommerce/config_all";
    return this.http.get(URL);
  }
}
