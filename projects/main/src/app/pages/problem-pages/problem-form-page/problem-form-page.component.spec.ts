import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemFormPageComponent } from './problem-form-page.component';

describe('ProblemFormPageComponent', () => {
  let component: ProblemFormPageComponent;
  let fixture: ComponentFixture<ProblemFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemFormPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
