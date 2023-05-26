import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeSubmitPageComponent } from './practice-submit-page.component';

describe('PracticeSubmitPageComponent', () => {
  let component: PracticeSubmitPageComponent;
  let fixture: ComponentFixture<PracticeSubmitPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticeSubmitPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeSubmitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
