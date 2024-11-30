import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleFileControlComponent } from './example-file-control.component';

describe('ExampleFileControlComponent', () => {
  let component: ExampleFileControlComponent;
  let fixture: ComponentFixture<ExampleFileControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExampleFileControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExampleFileControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
