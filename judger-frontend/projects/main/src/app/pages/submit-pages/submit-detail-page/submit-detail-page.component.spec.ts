import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitDetailPageComponent } from './submit-detail-page.component';

describe('SubmitDetailPageComponent', () => {
  let component: SubmitDetailPageComponent;
  let fixture: ComponentFixture<SubmitDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
