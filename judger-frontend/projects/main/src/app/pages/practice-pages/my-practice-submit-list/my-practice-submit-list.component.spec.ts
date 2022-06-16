import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPracticeSubmitListComponent } from './my-practice-submit-list.component';

describe('MyPracticeSubmitListComponent', () => {
  let component: MyPracticeSubmitListComponent;
  let fixture: ComponentFixture<MyPracticeSubmitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyPracticeSubmitListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPracticeSubmitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
