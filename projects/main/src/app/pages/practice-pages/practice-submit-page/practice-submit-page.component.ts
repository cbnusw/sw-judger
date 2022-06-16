import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AbstractFormDirective } from '../../../classes/abstract-form.directive';
import { ErrorMatcher } from '../../../classes/error-matcher';
import { PROGRAMMING_LANGUAGES } from '../../../constants';
import { IAssignment } from '../../../models/assignment';
import { IContest } from '../../../models/contest';
import { IFile } from '../../../models/file';
import { IProblem } from '../../../models/problem';
import { ISubmit } from '../../../models/submit';
import { PracticeService } from '../../../services/apis/practice.service';
import { ProblemService } from '../../../services/apis/problem.service';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'sw-practice-submit-page',
  templateUrl: './practice-submit-page.component.html',
  styleUrls: ['./practice-submit-page.component.scss']
})
export class PracticeSubmitPageComponent extends AbstractFormDirective<ISubmit, boolean> implements OnInit {
  contest: IContest;
  assignment: IAssignment;
  problem: IProblem;
  selectedFile: IFile;
  languages = PROGRAMMING_LANGUAGES;

  errorMatcher = new ErrorMatcher(this.submitted$, this.submissionError$);

  constructor(
    public auth: AuthService,
    public layout: LayoutService,
    private problemService: ProblemService,
    private practiceService: PracticeService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router,
    fb: FormBuilder
  ) {
    super(fb);
  }

  protected async processAfterSubmission(s: boolean): Promise<void> {
    alert('문제에 대한 소스코드를 제출하였습니다.\n결과가 나오지 않는다면 새로고침 해 주세요.');
    await this.router.navigate(['/practice/submit',this.problem._id,'my-list']);
  }

  get sourceFilename(): string {
    if (this.selectedFile) {
      return this.selectedFile.filename;
    }
    return null;
  }

  changeSourceFile(files: File[]): void {
    const file = files[0];
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }
    this.uploadService.upload(file).subscribe((res) => {
      this.selectedFile = res.data;
      this.formGroup.get('source').setValue(res.url);
    });
  }

  cancel(): void {
    this.router.navigate(['/practice/detail', this.problem._id]);
  }

  protected initFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      parentId: [null],
      parentType: ['Practice'],
      problem: [null, [Validators.required]],
      source: [null, [Validators.required]],
      language: [null, [Validators.required]],
    });
  }

  protected submitObservable(m: ISubmit): Observable<boolean> {
    return this.practiceService.submit(m, this.problem._id).pipe(map((res) => res.success));
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => params.id),
        switchMap(id => id ? this.practiceService.getPractice(id) : of({ data: null }))
      )
      .subscribe(
        (res) => {
          this.problem = res.data;
          this.formGroup.get('problem').setValue(this.problem._id)
        },
        (err) => {
          alert(`문제에 접근할 권한이 없습니다.\n${(err.error && err.error.message) || err.message}`);
          this.router.navigate(['/practice/detail', this.problem._id]);
        }
      );
  }
}
