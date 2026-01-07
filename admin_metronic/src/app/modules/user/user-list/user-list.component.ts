import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAddComponent } from '../user-add/user-add.component';
import { UserService } from '../service/user.service';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserDeleteComponent } from '../user-delete/user-delete.component';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  USERS: any = [];
    isLoading: any = null;
    search:any = null;
    state:any = null;
    type:any = null;
    title: string = 'Gestión de usuarios';
    constructor(
      public modalService: NgbModal,
      public userService: UserService,
      public activedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
      this.isLoading = this.userService.isLoading$;

      this.activedRoute.queryParams.subscribe((resp:any) => {
        this.type = resp.type;
        
        if (this.type === 'student') this.title = 'Gestión de Estudiantes';
        else if (this.type === 'instructor') this.title = 'Gestión de Profesores';
        else this.title = 'Gestión de Usuarios';

        this.listUser();
      })
    }

    listUser(){
      this.userService.listUsers(this.search, this.state, this.type).subscribe((resp: any) => {
        console.log(resp);
        this.USERS = resp.users.data;
      })
    }

    openModalCreateUser() {
      const modalRef = this.modalService.open(UserAddComponent, { centered: true, size: 'md' });

      modalRef.componentInstance.UserC.subscribe((User:any) =>{
        console.log(User);
        this.USERS.unshift(User);
      })
    }

    editUser(USER:any){
      const modalRef = this.modalService.open(UserEditComponent, { centered: true, size: 'md' });
      modalRef.componentInstance.user = USER;

      modalRef.componentInstance.UserE.subscribe((User:any) =>{
        console.log(User);
        let INDEX = this.USERS.findIndex((item:any) => item.id == User.id);
        this.USERS[INDEX] = User;
      })
    }

    deleteUser(USER:any){
      const modalRef = this.modalService.open(UserDeleteComponent, { centered: true, size: 'md' });
      modalRef.componentInstance.user = USER;

      modalRef.componentInstance.UserD.subscribe((respr:any) =>{
        let INDEX = this.USERS.findIndex((item:any) => item.id == USER.id);
        this.USERS.splice(INDEX,1);
      })
    }
}
