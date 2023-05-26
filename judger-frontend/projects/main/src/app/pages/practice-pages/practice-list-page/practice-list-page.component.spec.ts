import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeListPageComponent } from './practice-list-page.component';

describe('PracticeListPageComponent', () => {
  let component: PracticeListPageComponent;
  let fixture: ComponentFixture<PracticeListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticeListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
