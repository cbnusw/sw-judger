import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { AbstractFormDirective } from '../../../classes/abstract-form.directive';
import { ErrorMatcher } from '../../../classes/error-matcher';
import { IContest } from '../../../models/contest';
import { IProblem } from '../../../models/problem';
import { ContestService } from '../../../services/apis/contest.service';
import { ProblemService } from '../../../services/apis/problem.service';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'sw-assignment-form-page',
  templateUrl: './assignment-form-page.component.html',
  styleUrls: ['./assignment-form-page.component.scss'],
})
export class AssignmentFormPageComponent
  extends AbstractFormDirective<IProblem, string>
  implements OnInit
{
  contest: IContest;
  errorMatcher = new ErrorMatcher(this.submitted$, this.submissionError$);

  constructor(
    public auth: AuthService,
    public layout: LayoutService,
    private route: ActivatedRoute,
    private router: Router,
    private contestService: ContestService,
    private problemService: ProblemService,
    fb: FormBuilder
  ) {
    super(fb);
  }

  cancel(): void {
    if (this.modifying) {
      this.contest
        ? this.router.navigate(['/problem/detail', this.model._id], {
            queryParams: { contest: this.contest._id },
          })
        : this.router.navigate(['/problem/detail', this.model._id]);
    } else {
      this.contest
        ? this.router.navigate(['/contest', this.contest._id, 'problems'])
        : this.router.navigateByUrl('/problem/list/me');
    }
  }

  async submit(): Promise<void> {
    await super.submit();
  }

  protected async processAfterSubmission(s: string): Promise<void> {
    if (this.contest) {
      await this.router.navigate(['/contest', this.contest._id, 'problems']);
    } else {
      await this.router.navigateByUrl('/problem/list/me');
    }
  }

  protected async mapToModel(m: IProblem): Promise<IProblem> {
    if (m.published) {
      m.published = this.contest ? this.contest.testPeriod.end : new Date();
    } else {
      m.published = null;
    }

    return m;
  }

  protected initFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      published: [false],
      ioSet: [null, Validators.required],
      options: formBuilder.group({
        maxRealTime: [null, [Validators.required, Validators.min(1)]],
        maxMemory: [null, [Validators.required, Validators.min(1)]],
      }),
      score: [1, [Validators.required, Validators.min(0)]],
    });
  }

  protected submitObservable(m: IProblem): Observable<string> {
    let observable: Observable<string>;

    if (this.contest) {
      observable = this.modifying
        ? this.contestService
            .updateContestProblem(this.contest._id, this.model._id, m)
            .pipe(map(() => this.contest._id))
        : this.contestService
            .createContestProblem(this.contest._id, m)
            .pipe(map(() => this.contest._id));
    } else {
      observable = this.modifying
        ? this.problemService
            .updateProblem(this.model._id, m)
            .pipe(map(() => this.model._id))
        : this.problemService.createProblem(m).pipe(map((res) => res.data._id));
    }

    return observable;
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.addSubcription(
      this.route.params
        .pipe(
          map((params) => params.id),
          filter((id) => !!id),
          switchMap((id) => this.problemService.getProblem(id))
        )
        .subscribe((res) => (this.model = res.data)),

      this.route.queryParams
        .pipe(
          map((params) => params.contest),
          filter((id) => !!id),
          switchMap((id) => this.contestService.getContest(id))
        )
        .subscribe((res) => (this.contest = res.data))
    );
  }
}
