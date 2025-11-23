import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentalAccountingComponent } from './departmental-accounting.component';

describe('DepartmentalAccountingComponent', () => {
  let component: DepartmentalAccountingComponent;
  let fixture: ComponentFixture<DepartmentalAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentalAccountingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentalAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
