import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeFormPageComponent } from './practice-form-page.component';

describe('PracticeFormPageComponent', () => {
  let component: PracticeFormPageComponent;
  let fixture: ComponentFixture<PracticeFormPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticeFormPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
