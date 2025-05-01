import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  name:any = null; 
  surname:any = null;
  email:any = null;
  password:any = null;
  confirmation_password:any = null;

  constructor() { }

  ngOnInit(): void {
  }

}
