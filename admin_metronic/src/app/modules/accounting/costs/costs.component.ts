import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountingService } from '../service/accounting.service';

@Component({
  selector: 'app-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.scss']
})
export class CostsComponent implements OnInit {

  costs: any[] = [];
  isLoading: any;
  title: string = '';
  amount: number = 0;
  type: number = 1; // Default: Profesor
  date: string = '';
  description: string = '';

  constructor(
    public accountingService: AccountingService,
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.accountingService.isLoading$;
    this.loadCosts();
  }

  loadCosts() {
    this.accountingService.getCostDetails().subscribe((resp: any) => {
      this.costs = resp.costs.data;
    })
  }

  openModal(content: any) {
    this.title = '';
    this.amount = 0;
    this.type = 1;
    this.date = new Date().toISOString().split('T')[0];
    this.description = '';
    this.modalService.open(content, { centered: true });
  }

  save() {
    if (!this.title || !this.amount || !this.date) {
      alert("Todos los campos obligatorios deben llenarse"); // Simple validation
      return;
    }

    let data = {
      title: this.title,
      amount: this.amount,
      type: this.type,
      date: this.date,
      description: this.description
    };

    this.accountingService.registerExpense(data).subscribe((resp: any) => {
      console.log(resp);
      this.modalService.dismissAll();
      this.loadCosts(); // Reload list
    })
  }
}
