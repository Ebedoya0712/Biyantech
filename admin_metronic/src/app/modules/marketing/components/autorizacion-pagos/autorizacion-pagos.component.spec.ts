import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizacionPagosComponent } from './autorizacion-pagos.component';

describe('AutorizacionPagosComponent', () => {
  let component: AutorizacionPagosComponent;
  let fixture: ComponentFixture<AutorizacionPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutorizacionPagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizacionPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
