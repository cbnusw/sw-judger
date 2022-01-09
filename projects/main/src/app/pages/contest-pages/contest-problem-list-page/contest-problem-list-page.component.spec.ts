import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestProblemListPageComponent } from './contest-problem-list-page.component';

describe('ContestProblemListPageComponent', () => {
  let component: ContestProblemListPageComponent;
  let fixture: ComponentFixture<ContestProblemListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestProblemListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestProblemListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
