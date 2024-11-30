import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestantsListComponent } from './contestants-list.component';

describe('ContestantsListComponent', () => {
  let component: ContestantsListComponent;
  let fixture: ComponentFixture<ContestantsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestantsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
