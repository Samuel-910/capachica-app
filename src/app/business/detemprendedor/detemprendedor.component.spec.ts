import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetemprendedorComponent } from './detemprendedor.component';

describe('DetemprendedorComponent', () => {
  let component: DetemprendedorComponent;
  let fixture: ComponentFixture<DetemprendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetemprendedorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetemprendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
