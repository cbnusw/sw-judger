import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentSubmitListPageComponent } from './assignment-submit-list-page.component';

describe('AssignmentSubmitListPageComponent', () => {
  let component: AssignmentSubmitListPageComponent;
  let fixture: ComponentFixture<AssignmentSubmitListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentSubmitListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentSubmitListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
