import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeDetailPageComponent } from './practice-detail-page.component';

describe('PracticeDetailPageComponent', () => {
  let component: PracticeDetailPageComponent;
  let fixture: ComponentFixture<PracticeDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticeDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
