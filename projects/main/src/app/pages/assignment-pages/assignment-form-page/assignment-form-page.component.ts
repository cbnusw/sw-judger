import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UploadService } from '../../../services/upload.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, map, switchMap } from 'rxjs/operators';
import { AbstractFormDirective } from '../../../classes/abstract-form.directive';
import { ErrorMatcher } from '../../../classes/error-matcher';
import { ActivatedRoute, Router } from '@angular/router';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { Observable } from 'rxjs';
import { IAssignment } from '../../../models/assignment';
import { AssignmentService } from '../../../services/apis/assignment.service';

export class UploadAdapter {
  constructor(private loader, private uploadService: UploadService) {}

  upload(): Promise<any> {
    return this.loader.file
      .then((file) => this.uploadService.upload(file).toPromise())
      .then((res) => ({ ...res.data, default: res.data.url }));
  }
}
@Component({
  selector: 'sw-assignment-form-page',
  templateUrl: './assignment-form-page.component.html',
  styleUrls: ['./assignment-form-page.component.scss'],
})
export class AssignmentFormPageComponent
  extends AbstractFormDirective<IAssignment, string>
  implements OnInit
{
  errorMatcher = new ErrorMatcher(this.submitted$, this.submissionError$);

  Editor = DecoupledEditor;

  config = {
    placeholder: '여기에 과제 내용 입력',
    language: 'ko',
  };

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private uploadService: UploadService,
    private assignmentService: AssignmentService,
    fb: FormBuilder
  ) {
    super(fb);
  }

  get isApplyingPeriod(): boolean {
    return this.formGroup.get('isApplyingPeriod').value;
  }

  onReady(editor: any): void {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader, this.uploadService);
    };

    editor.ui
      .getEditableElement()
      .parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
  }

  protected async processAfterSubmission(id: string): Promise<void> {
    alert(`과제${this.modifying ? '수정' : '등록'}을 완료하였습니다.`);
    await this.router.navigate(['/assignment/detail', id]);
  }

  protected initFormGroup(formBuilder: FormBuilder): FormGroup {
    const formGroup = formBuilder.group({
      title: [null, [Validators.required]],
      course: [null, [Validators.required]],
      content: [null, [Validators.required]],
      testPeriod: [
        null,
        [
          Validators.required,
          (control) => {
            let { start, end } = control.value || {};
            if (start && end) {
              start = new Date(start);
              end = new Date(end);
              return start.getTime() >= end.getTime()
                ? { invalidPeriod: true }
                : null;
            }
            return null;
          },
        ],
      ],
    });

    return formGroup;
  }

  protected submitObservable(m: IAssignment): Observable<string> {
    return this.modifying
      ? this.assignmentService
          .updateAssignment(this.model._id, m)
          .pipe(map(() => this.model._id))
      : this.assignmentService
          .createAssignment(m)
          .pipe(map((res) => res.data._id));
  }

  cancel(): void {
    if (this.modifying) {
      this.router.navigate(['/assignment/detail', this.model._id]);
    } else {
      this.router.navigateByUrl('/assignment/list/me');
    }
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.addSubcription(
      this.auth.me$
        .pipe(
          filter((me) => !!me),
          switchMap(() => this.route.params),
          map((params) => params.id),
          filter((id) => !!id),
          switchMap((id) => this.assignmentService.getAssignment(id))
        )
        .subscribe(
          (res) => {
            if (res.data.writer._id !== this.auth.me._id) {
              alert('수정 권한이 없습니다.');
              this.router.navigateByUrl('/');
            } else {
              this.model = res.data;
            }
          },
          (err) => {
            alert(`${(err.error && err.error.message) || err.message}`);
            this.router.navigateByUrl('/');
          }
        )
    );
  }
}
