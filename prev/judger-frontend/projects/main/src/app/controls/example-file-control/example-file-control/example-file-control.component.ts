import { Component, forwardRef, OnInit, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { from } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import { IFile } from '../../../models/file';
import { UploadService } from '../../../services/upload.service';

const CONTROL_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ExampleFileControlComponent),
  multi: true,
};

@Component({
  selector: 'sw-example-file-control',
  templateUrl: './example-file-control.component.html',
  styleUrls: ['./example-file-control.component.scss'],
  providers: [CONTROL_ACCESSOR],
})
export class ExampleFileControlComponent implements ControlValueAccessor, OnInit {
  private onChange: any;
  private onTouched: any;

  progress = 0;
  loading: boolean;
  uploadedFiles: IFile[] = [];
  validExtensions = ['.java', '.py', '.c', '.cpp'];

  constructor(private uploadService: UploadService) {}

  // 파일 확장자 체크
  isValidFileExtension(fileName: string): boolean {
    return this.validExtensions.some(ext => fileName.endsWith(ext));
  }

  uploadFiles(files: File[]): void {
    // 허용된 확장자에 해당하는 파일 필터링
    const validFiles = files.filter(file => this.isValidFileExtension(file.name));
    
    if (validFiles.length !== files.length) {
      alert('허용되지 않은 파일 확장자가 포함되어 있습니다. (.java, .py, .c, .cpp만 허용)');
    }

    const uploads = validFiles;
    const uploadResponses: IFile[] = [];

    this.loading = true;

    from(uploads)
      .pipe(
        concatMap((file) => this.uploadService.upload(file)),
        finalize(() => {
          this.loading = false;
          this.progress = 0;
        })
      )
      .subscribe(
        (res) => {
          uploadResponses.push(res.data);
          this.progress = (uploadResponses.length / uploads.length) * 100;
        },
        (err) => console.error(err),
        () => {
          this.uploadedFiles = [
            ...this.uploadedFiles,
            ...uploadResponses,
          ];

          this.change();
        }
      );
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    this.change();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    this.uploadedFiles = obj || [];
  }

  ngOnInit(): void {}

  private change(): void {
    if (this.onChange) {
      this.onChange(this.uploadedFiles.length > 0 ? this.uploadedFiles : null);
    }
  }
}
