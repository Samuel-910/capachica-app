import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEmprendimientoComponent } from './form-emprendimiento.component';

describe('FormEmprendimientoComponent', () => {
  let component: FormEmprendimientoComponent;
  let fixture: ComponentFixture<FormEmprendimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEmprendimientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormEmprendimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
