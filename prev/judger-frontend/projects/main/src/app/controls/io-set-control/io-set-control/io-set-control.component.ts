import { Component, forwardRef, OnInit, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { from } from 'rxjs';
import { concatMap, finalize } from 'rxjs/operators';
import { IFile } from '../../../models/file';
import { IInputOutput } from '../../../models/problem';
import { LayoutService } from '../../../services/layout.service';
import { UploadService } from '../../../services/upload.service';

const CONTROL_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IoSetControlComponent),
  multi: true,
};

@Component({
  selector: 'sw-io-set-control',
  templateUrl: './io-set-control.component.html',
  styleUrls: ['./io-set-control.component.scss'],
  providers: [CONTROL_ACCESSOR],
})
export class IoSetControlComponent implements ControlValueAccessor, OnInit {
  private onChange: any;
  private onTouched: any;

  progress = 0;
  loading: boolean;
  inExt = '.in';
  outExt = '.out';
  value: IInputOutput[] = [];

  constructor(public layout: LayoutService, private uploadService: UploadService) {}

  get sameExt(): boolean {
    return this.inExt === this.outExt;
  }

  uploadIoSet(files: File[]): void {
    const filter = (ext) => {
      if (ext) {
        return files.filter((file) => file.name.endsWith(ext));
      }
      return files.filter((file) => file.name.split('.').length === 1);
    };

    let inFiles = filter(this.inExt);
    let outFiles = filter(this.outExt);

    inFiles = inFiles.filter((i) => outFiles.some((o) => o.name.split('.')[0] === i.name.split('.')[0]));
    outFiles = outFiles.filter((o) => inFiles.some((i) => i.name.split('.')[0] === o.name.split('.')[0]));

    const uploads = [...inFiles, ...outFiles];
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
          const inList = uploadResponses.filter((file) =>
            this.inExt ? file.filename.endsWith(this.inExt) : file.filename.split('.').length === 1
          );
          const outList = uploadResponses.filter((file) =>
            this.outExt ? file.filename.endsWith(this.outExt) : file.filename.split('.').length === 1
          );

          this.value = [
            ...this.value,
            ...inList
              .map((inFile) => {
                const outFile = outList.find((f) => f.filename.split('.')[0] === inFile.filename.split('.')[0]);
                return outFile ? { inFile, outFile } : null;
              })
              .filter((inOut) => !!inOut),
          ];

          this.change();
        }
      );
  }

  checkExt(): void {
    if (this.sameExt) {
      alert('입/출력 파일의 확장자는 다르게 설정해야 합니다.');
    }
  }

  removeIo(i: number): void {
    this.value.splice(i, 1);
    this.change();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    this.value = obj || [];
  }

  ngOnInit(): void {}

  private change(): void {
    if (!this.onChange) {
      return;
    }
    this.onChange(this.value.length > 0 ? this.value : null);
  }
}
