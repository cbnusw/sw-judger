import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodControlComponent } from './period-control.component';

describe('PeriodControlComponent', () => {
  let component: PeriodControlComponent;
  let fixture: ComponentFixture<PeriodControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
