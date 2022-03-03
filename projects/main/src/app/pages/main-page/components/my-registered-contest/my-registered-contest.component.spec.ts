import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRegisteredContestComponent } from './my-registered-contest.component';

describe('MyRegisteredContestComponent', () => {
  let component: MyRegisteredContestComponent;
  let fixture: ComponentFixture<MyRegisteredContestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRegisteredContestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRegisteredContestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
