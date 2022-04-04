import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemDetailPageComponent } from './problem-detail-page.component';

describe('ProblemDetailPageComponent', () => {
  let component: ProblemDetailPageComponent;
  let fixture: ComponentFixture<ProblemDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
