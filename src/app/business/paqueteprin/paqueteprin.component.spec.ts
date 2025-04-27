import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaqueteprinComponent } from './paqueteprin.component';

describe('PaqueteprinComponent', () => {
  let component: PaqueteprinComponent;
  let fixture: ComponentFixture<PaqueteprinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaqueteprinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaqueteprinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
