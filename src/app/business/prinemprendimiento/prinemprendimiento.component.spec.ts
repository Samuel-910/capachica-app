import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinemprendimientoComponent } from './prinemprendimiento.component';

describe('PrinemprendimientoComponent', () => {
  let component: PrinemprendimientoComponent;
  let fixture: ComponentFixture<PrinemprendimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrinemprendimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrinemprendimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
