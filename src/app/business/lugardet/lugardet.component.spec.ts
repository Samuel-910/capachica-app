import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LugardetComponent } from './lugardet.component';

describe('LugardetComponent', () => {
  let component: LugardetComponent;
  let fixture: ComponentFixture<LugardetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LugardetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LugardetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
