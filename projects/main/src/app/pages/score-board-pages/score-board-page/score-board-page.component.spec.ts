import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreBoardPageComponent } from './score-board-page.component';

describe('ScoreBoardPageComponent', () => {
  let component: ScoreBoardPageComponent;
  let fixture: ComponentFixture<ScoreBoardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreBoardPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreBoardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
