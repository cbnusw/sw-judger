import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAssignmentListPageComponent } from './my-assignment-list-page.component';

describe('MyAssignmentListPageComponent', () => {
  let component: MyAssignmentListPageComponent;
  let fixture: ComponentFixture<MyAssignmentListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAssignmentListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAssignmentListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
