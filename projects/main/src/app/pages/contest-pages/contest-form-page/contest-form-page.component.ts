import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AbstractFormDirective } from '../../../classes/abstract-form.directive';
import { ErrorMatcher } from '../../../classes/error-matcher';
import { IContest } from '../../../models/contest';
import { ContestService } from '../../../services/apis/contest.service';
import { AuthService } from '../../../services/auth.service';
import { UploadService } from '../../../services/upload.service';

export class UploadAdapter {
  constructor(private loader, private uploadService: UploadService) {
  }

  upload(): Promise<any> {
    return this.loader.file.then(file => this.uploadService.upload(file).toPromise())
      .then(res => ({ ...res.data, default: res.data.url }));
  }
}

@Component({
  selector: 'sw-contest-form-page',
  templateUrl: './contest-form-page.component.html',
  styleUrls: ['./contest-form-page.component.scss']
})
export class ContestFormPageComponent extends AbstractFormDirective<IContest, string> implements OnInit {

  errorMatcher = new ErrorMatcher(this.submitted$, this.submissionError$);

  Editor = DecoupledEditor;

  config = {
    placeholder: '여기에 대회 내용 입력',
    language: 'ko'
  };

  constructor(public auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private uploadService: UploadService,
              private contestService: ContestService,
              fb: FormBuilder) {
    super(fb);
  }

  get isApplyingPeriod(): boolean {
    return this.formGroup.get('isApplyingPeriod').value;
  }

  onReady(editor: any): void {
    editor.plugins.get('FileRepository').createUploadAdapter = loader => {
      return new UploadAdapter(loader, this.uploadService);
    };

    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }


  protected async mapToModel(m: IContest): Promise<IContest> {
    if (!(m as any).isApplyingPeriod) {
      m.applyingPeriod = null;
    }

    delete (m as any).isApplyingPeriod;

    return m;
  }

  protected async processAfterSubmission(id: string): Promise<void> {
    alert(`대회 ${this.modifying ? '수정' : '등록'}을 완료하였습니다.`);
    await this.router.navigate(['/contest/detail', id]);
  }

  protected patchFormGroup(m: IContest): void {
    if (m.applyingPeriod) {
      (m as any).isApplyingPeriod = true;
    }
    super.patchFormGroup(m);
  }

  protected initFormGroup(formBuilder: FormBuilder): FormGroup {
    const formGroup = formBuilder.group({
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      testPeriod: [null, [
        Validators.required,
        control => {
          let { start, end } = control.value || {};
          if (start && end) {
            start = new Date(start);
            end = new Date(end);
            return start.getTime() >= end.getTime() ? { invalidPeriod: true } : null;
          }
          return null;
        }
      ]],
      isApplyingPeriod: [false],
      applyingPeriod: [null],
    });

    formGroup.setValidators([
      form => {
        const testPeriod = form.get('testPeriod').value;
        const applyingPeriod = form.get('applyingPeriod').value;
        const isApplyingPeriod = form.get('isApplyingPeriod').value;

        if (!isApplyingPeriod) {
          return null;
        }

        if (!applyingPeriod) {
          return { requiredApplyingPeriod: true };
        }

        let { start, end } = applyingPeriod;

        start = new Date(start);
        end = new Date(end);

        if (start.getTime() >= end.getTime()) {
          return { invalidApplyingPeriod: true };
        }

        if (testPeriod) {
          let { start: testStart } = testPeriod;

          testStart = new Date(testStart);

          if (end.getTime() > testStart.getTime()) {
            return { overlapApplyingPeriod: true };
          }
        }

        return null;
      }
    ]);

    return formGroup;
  }

  protected submitObservable(m: IContest): Observable<string> {
    return this.modifying ?
      this.contestService.updateContest(this.model._id, m).pipe(map(() => this.model._id)) :
      this.contestService.createContest(m).pipe(map(res => res.data._id));
  }


  cancel(): void {
    if (this.modifying) {
      this.router.navigate(['/contest/detail', this.model._id]);
    } else {
      this.router.navigateByUrl('/contest/list/me');
    }
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.addSubcription(
      this.auth.me$.pipe(
        filter(me => !!me),
        switchMap(() => this.route.params),
        map(params => params.id),
        filter(id => !!id),
        switchMap(id => this.contestService.getContest(id))
      ).subscribe(
        res => {
          if (res.data.writer._id !== this.auth.me._id) {
            alert('수정 권한이 없습니다.');
            this.router.navigateByUrl('/');
          } else {
            this.model = res.data;
          }
        },
        err => {
          alert(`${err.error && err.error.message || err.message}`);
          this.router.navigateByUrl('/');
        }
      )
    );
  }
}
