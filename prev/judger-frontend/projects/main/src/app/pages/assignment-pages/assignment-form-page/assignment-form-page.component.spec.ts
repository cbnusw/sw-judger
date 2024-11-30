import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentFormPageComponent } from './assignment-form-page.component';

describe('AssignmentFormPageComponent', () => {
  let component: AssignmentFormPageComponent;
  let fixture: ComponentFixture<AssignmentFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentFormPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
