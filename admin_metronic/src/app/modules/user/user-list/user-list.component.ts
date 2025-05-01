import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAddComponent } from '../user-add/user-add.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  constructor(
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }
  openModalCreateUser(){
      const modalRef = this.modalService.open(UserAddComponent,{centered: true, size: 'md'});
  }
}
