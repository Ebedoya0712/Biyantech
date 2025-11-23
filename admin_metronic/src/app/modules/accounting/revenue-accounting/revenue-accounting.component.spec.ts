import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueAccountingComponent } from './revenue-accounting.component';

describe('RevenueAccountingComponent', () => {
  let component: RevenueAccountingComponent;
  let fixture: ComponentFixture<RevenueAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueAccountingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
