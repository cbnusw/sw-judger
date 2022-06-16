import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeSubmitListPageComponent } from './practice-submit-list-page.component';

describe('PracticeSubmitListPageComponent', () => {
  let component: PracticeSubmitListPageComponent;
  let fixture: ComponentFixture<PracticeSubmitListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticeSubmitListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeSubmitListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
