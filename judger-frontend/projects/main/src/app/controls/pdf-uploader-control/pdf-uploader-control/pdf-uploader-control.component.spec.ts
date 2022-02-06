import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdfUploaderControlComponent } from './pdf-uploader-control.component';

describe('PdfUploaderControlComponent', () => {
  let component: PdfUploaderControlComponent;
  let fixture: ComponentFixture<PdfUploaderControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfUploaderControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfUploaderControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
