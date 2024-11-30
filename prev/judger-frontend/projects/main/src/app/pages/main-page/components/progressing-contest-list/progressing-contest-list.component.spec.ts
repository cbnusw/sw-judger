import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressingContestListComponent } from './progressing-contest-list.component';

describe('ProgressingContestListComponent', () => {
  let component: ProgressingContestListComponent;
  let fixture: ComponentFixture<ProgressingContestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressingContestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressingContestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
