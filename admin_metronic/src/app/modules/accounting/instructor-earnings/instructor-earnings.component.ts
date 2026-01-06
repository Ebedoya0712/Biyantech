import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../service/accounting.service';

@Component({
  selector: 'app-instructor-earnings',
  templateUrl: './instructor-earnings.component.html',
  styleUrls: ['./instructor-earnings.component.scss']
})
export class InstructorEarningsComponent implements OnInit {

  total_revenue: number = 0;
  total_commission: number = 0;
  earnings_by_course: any[] = [];
  isLoading: any;

  constructor(public accountingService: AccountingService) { }

  ngOnInit(): void {
    this.isLoading = this.accountingService.isLoading$; 
    this.loadInstructorEarnings();
  }

  loadInstructorEarnings() {
    this.accountingService.getInstructorEarnings().subscribe((resp: any) => {
      console.log(resp);
      this.total_revenue = resp.total_revenue;
      this.total_commission = resp.total_commission;
      this.earnings_by_course = resp.earnings_by_course;
    })
  }
}
