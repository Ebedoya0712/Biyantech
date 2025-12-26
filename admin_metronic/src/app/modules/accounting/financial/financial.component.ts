import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../service/accounting.service';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {

  total_revenue: number = 0;
  total_costs: number = 0;
  net_profit: number = 0;
  company_reserve: number = 0;
  profit_split: any = { me: 0, partner: 0 };
  monthly_trend: any[] = [];
  isLoading: any;

  constructor(public accountingService: AccountingService) { }

  ngOnInit(): void {
    this.isLoading = this.accountingService.isLoading$; 
    this.loadFinancialSummary();
  }

  loadFinancialSummary() {
    this.accountingService.getFinancialSummary().subscribe((resp: any) => {
      console.log(resp);
      this.total_revenue = resp.total_revenue;
      this.total_costs = resp.total_costs;
      this.net_profit = resp.net_profit;
      this.company_reserve = resp.company_reserve;
      this.profit_split = resp.profit_split;
      this.monthly_trend = resp.monthly_trend;
    })
  }
}
