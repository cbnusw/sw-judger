import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeMainPageComponent } from './notice-main-page.component';

describe('NoticeMainPageComponent', () => {
  let component: NoticeMainPageComponent;
  let fixture: ComponentFixture<NoticeMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticeMainPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
