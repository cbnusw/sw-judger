import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitListPageComponent } from './submit-list-page.component';

describe('SubmitListPageComponent', () => {
  let component: SubmitListPageComponent;
  let fixture: ComponentFixture<SubmitListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
