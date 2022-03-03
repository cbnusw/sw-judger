import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestFormPageComponent } from './contest-form-page.component';

describe('ContestFormPageComponent', () => {
  let component: ContestFormPageComponent;
  let fixture: ComponentFixture<ContestFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestFormPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
