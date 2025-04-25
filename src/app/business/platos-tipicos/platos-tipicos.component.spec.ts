import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatosTipicosComponent } from './platos-tipicos.component';

describe('PlatosTipicosComponent', () => {
  let component: PlatosTipicosComponent;
  let fixture: ComponentFixture<PlatosTipicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatosTipicosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlatosTipicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
