import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyContestListPageComponent } from './my-contest-list-page.component';

describe('MyContestListPageComponent', () => {
  let component: MyContestListPageComponent;
  let fixture: ComponentFixture<MyContestListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyContestListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyContestListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
