import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestListPageComponent } from './contest-list-page.component';

describe('ContestListPageComponent', () => {
  let component: ContestListPageComponent;
  let fixture: ComponentFixture<ContestListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
