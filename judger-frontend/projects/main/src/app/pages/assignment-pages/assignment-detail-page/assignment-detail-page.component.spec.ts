import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentDetailPageComponent } from './assignment-detail-page.component';

describe('AssignmentDetailPageComponent', () => {
  let component: AssignmentDetailPageComponent;
  let fixture: ComponentFixture<AssignmentDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
