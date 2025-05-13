import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetprinlugaresComponent } from './detprinlugares.component';

describe('DetprinlugaresComponent', () => {
  let component: DetprinlugaresComponent;
  let fixture: ComponentFixture<DetprinlugaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetprinlugaresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetprinlugaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
