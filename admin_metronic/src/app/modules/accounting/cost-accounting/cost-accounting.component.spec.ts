import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostAccountingComponent } from './cost-accounting.component';

describe('CostAccountingComponent', () => {
  let component: CostAccountingComponent;
  let fixture: ComponentFixture<CostAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostAccountingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
