import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LugarprinComponent } from './lugarprin.component';

describe('LugarprinComponent', () => {
  let component: LugarprinComponent;
  let fixture: ComponentFixture<LugarprinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LugarprinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LugarprinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
