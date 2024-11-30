import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentProblemListPageComponent } from './assignment-problem-list-page.component';

describe('AssignmentProblemListPageComponent', () => {
  let component: AssignmentProblemListPageComponent;
  let fixture: ComponentFixture<AssignmentProblemListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentProblemListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentProblemListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
