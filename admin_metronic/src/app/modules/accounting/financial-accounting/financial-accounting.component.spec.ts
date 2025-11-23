import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAccountingComponent } from './financial-accounting.component';

describe('FinancialAccountingComponent', () => {
  let component: FinancialAccountingComponent;
  let fixture: ComponentFixture<FinancialAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialAccountingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
