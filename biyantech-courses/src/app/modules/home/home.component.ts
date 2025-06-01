import { Component, OnInit } from '@angular/core';
import { HomeService } from './services/home.service';

declare var $:any ;
declare function HOMEINIT([]):any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  CATEGORIES:any = [];
  COURSES_HOME:any = [];

  constructor(
    public homeService: HomeService,
  ){
    setTimeout(() => {
      HOMEINIT($);
    }, 50);
  }

    ngOnInit(): void {
        this.homeService.home().subscribe((resp:any) => {
            console.log(resp);
            this.CATEGORIES = resp.categories;
            this.COURSES_HOME = resp.courses_home.data;
        });
    }
}
