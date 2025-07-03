import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class TiendaGuestService {

  constructor(
    public http: HttpClient,
  ) { }

  landingCourse(slug: string){
    let URL = URL_SERVICIOS + "/ecommerce/course-detail/" + slug;
    return this.http.get(URL);
  }
}
