import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPaqueteComponent } from './form-paquete.component';

describe('FormPaqueteComponent', () => {
  let component: FormPaqueteComponent;
  let fixture: ComponentFixture<FormPaqueteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPaqueteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPaqueteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
