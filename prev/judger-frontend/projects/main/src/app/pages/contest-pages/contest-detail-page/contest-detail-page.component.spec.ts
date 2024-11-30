import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestDetailPageComponent } from './contest-detail-page.component';

describe('ContestDetailPageComponent', () => {
  let component: ContestDetailPageComponent;
  let fixture: ComponentFixture<ContestDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
