import { Component, forwardRef, OnInit, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { finalize, map } from 'rxjs/operators';
import { UploadService } from '../../../services/upload.service';

const CONTROL_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PdfUploaderControlComponent),
  multi: true,
};

@Component({
  selector: 'sw-pdf-uploader-control',
  templateUrl: './pdf-uploader-control.component.html',
  styleUrls: ['./pdf-uploader-control.component.scss'],
  providers: [CONTROL_ACCESSOR]
})
export class PdfUploaderControlComponent implements ControlValueAccessor, OnInit {

  private onChange: any;
  private onTouched: any;

  value: string;
  loading: boolean;
  page: number;
  lastPage: number;

  constructor(private uploadService: UploadService) {
  }

  uploadPdf(files: File[]): void {
    const file = files[0];
    this.loading = false;
    this.uploadService.upload(file).pipe(
      finalize(() => this.loading = false),
      map(res => res.data.url),
    ).subscribe(
      url => {
        this.value = url;
        this.page = 1;
        this.change();
      },
      err => alert('파일 업로드에 실패하였습니다.')
    );
  }

  prevPage(): void {
    this.page--;
  }

  nextPage(): void {
    this.page++;
  }

  close(): void {
    this.value = null;
    this.change();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: string): void {
    this.value = obj;
  }

  ngOnInit(): void {
  }

  private change(): void {
    if (this.onChange) {
      this.onChange(this.value);
    }
  }

  load(event: PDFDocumentProxy): void {
    this.lastPage = (event as any)._pdfInfo.numPages;
  }
}
