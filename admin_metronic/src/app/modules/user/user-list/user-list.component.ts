import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAddComponent } from '../user-add/user-add.component';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  USERS: any = [];
  constructor(
    public modalService: NgbModal,
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.listUsers().subscribe((resp: any) => {
      console.log(resp);
      this.USERS = resp.users.data;
    })
  }
  openModalCreateUser() {
    const modalRef = this.modalService.open(UserAddComponent, { centered: true, size: 'md' });
  }
}
