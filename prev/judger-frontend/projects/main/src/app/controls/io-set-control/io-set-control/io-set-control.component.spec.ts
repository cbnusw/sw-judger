import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IoSetControlComponent } from './io-set-control.component';

describe('IoSetControlComponent', () => {
  let component: IoSetControlComponent;
  let fixture: ComponentFixture<IoSetControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IoSetControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IoSetControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
