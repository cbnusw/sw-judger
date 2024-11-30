import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentManualDialogComponent } from './assignment-manual-dialog.component';

describe('AssignmentManualDialogComponent', () => {
  let component: AssignmentManualDialogComponent;
  let fixture: ComponentFixture<AssignmentManualDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentManualDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentManualDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
