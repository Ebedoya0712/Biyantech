import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../service/accounting.service';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent implements OnInit {

  sales: any[] = [];
  isLoading: any;

  constructor(public accountingService: AccountingService) { }

  ngOnInit(): void {
    this.isLoading = this.accountingService.isLoading$;
    this.loadRevenue();
  }

  loadRevenue() {
    this.accountingService.getRevenueDetails().subscribe((resp: any) => {
      this.sales = resp.sales.data;
    })
  }
}
