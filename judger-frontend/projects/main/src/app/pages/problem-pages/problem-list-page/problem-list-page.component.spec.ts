import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemListPageComponent } from './problem-list-page.component';

describe('ProblemListPageComponent', () => {
  let component: ProblemListPageComponent;
  let fixture: ComponentFixture<ProblemListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
