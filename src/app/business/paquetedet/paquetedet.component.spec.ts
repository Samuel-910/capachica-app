import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaquetedetComponent } from './paquetedet.component';

describe('PaquetedetComponent', () => {
  let component: PaquetedetComponent;
  let fixture: ComponentFixture<PaquetedetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaquetedetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaquetedetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
