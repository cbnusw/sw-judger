import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitResultListComponent } from './submit-result-list.component';

describe('SubmitResultListComponent', () => {
  let component: SubmitResultListComponent;
  let fixture: ComponentFixture<SubmitResultListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitResultListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
