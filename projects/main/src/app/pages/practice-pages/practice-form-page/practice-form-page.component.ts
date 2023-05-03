import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AbstractFormDirective } from '../../../classes/abstract-form.directive';
import { ErrorMatcher } from '../../../classes/error-matcher';
import { IProblem } from '../../../models/problem';
import { IResponse } from '../../../models/response';
import { PracticeService } from '../../../services/apis/practice.service';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'sw-practice-form-page',
  templateUrl: './practice-form-page.component.html',
  styleUrls: ['./practice-form-page.component.scss']
})
export class PracticeFormPageComponent extends AbstractFormDirective<IProblem, boolean> {

  errorMatcher = new ErrorMatcher(this.submitted$, this.submissionError$)

  constructor(
    public auth: AuthService,
    public layout: LayoutService,
    private route: ActivatedRoute,
    private router: Router,
    private practiceService: PracticeService,
    fb: FormBuilder
  ) {
    super(fb);
  }

  ngOnInit() {
    super.ngOnInit();

    this.addSubcription(
      this.route.params.pipe(
        map(params => params['id']),
        switchMap(id => id ? this.practiceService.getPractice(id) : of({ data: null }))
      ).subscribe(res => this.model = res.data ?? null));
  }

  cancel(): void {
    this.modifying
      ? this.router.navigate(['/practice/detail', this.model._id])
      : this.router.navigate(['/practice/list'])
  }

  protected initFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      published: [null],
      ioSet: [null, Validators.required],
      options: formBuilder.group({
        maxRealTime: [null, [Validators.required, Validators.min(1)]],
        maxMemory: [null, [Validators.required, Validators.min(1)]],
      }),
      score: [null, [Validators.required, Validators.pattern('[1-5]')]]
    })
  }

  protected submitObservable(m: IProblem): Observable<boolean> {
    const observable: Observable<IResponse<IProblem | undefined>> = this.modifying
      ? this.practiceService.updatePractice(m, this.model._id)
      : this.practiceService.registerPractice(m);
    return observable.pipe(map(res => res.success || false))
  }

  protected async processAfterSubmission(s: boolean): Promise<void> {
    await this.router.navigateByUrl('/practice/list');
  }

}
