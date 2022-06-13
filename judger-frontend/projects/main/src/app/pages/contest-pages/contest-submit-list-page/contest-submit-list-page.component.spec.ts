import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestSubmitListPageComponent } from './contest-submit-list-page.component';

describe('ContestSubmitListPageComponent', () => {
  let component: ContestSubmitListPageComponent;
  let fixture: ComponentFixture<ContestSubmitListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestSubmitListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestSubmitListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
