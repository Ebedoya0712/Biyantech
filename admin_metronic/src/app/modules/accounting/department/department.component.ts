import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../service/accounting.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  departments: any[] = [];
  isLoading: any;

  constructor(public accountingService: AccountingService) { }

  ngOnInit(): void {
    this.isLoading = this.accountingService.isLoading$;
    this.loadDepartments();
  }

  loadDepartments() {
    this.accountingService.getDepartmentDetails().subscribe((resp: any) => {
      this.departments = resp.departments;
    })
  }

}
