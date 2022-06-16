import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeSubmitDetailPageComponent } from './practice-submit-detail-page.component';

describe('PracticeSubmitDetailPageComponent', () => {
  let component: PracticeSubmitDetailPageComponent;
  let fixture: ComponentFixture<PracticeSubmitDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticeSubmitDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeSubmitDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
