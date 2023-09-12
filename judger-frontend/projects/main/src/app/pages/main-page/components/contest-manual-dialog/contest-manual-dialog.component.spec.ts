import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestManualDialogComponent } from './contest-manual-dialog.component';

describe('ContestManualDialogComponent', () => {
  let component: ContestManualDialogComponent;
  let fixture: ComponentFixture<ContestManualDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestManualDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestManualDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
