import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProblemListPageComponent } from './my-problem-list-page.component';

describe('MyProblemListPageComponent', () => {
  let component: MyProblemListPageComponent;
  let fixture: ComponentFixture<MyProblemListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyProblemListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProblemListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
