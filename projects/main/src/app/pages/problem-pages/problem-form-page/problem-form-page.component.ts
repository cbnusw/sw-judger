import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { relativeTimeThreshold } from 'moment';
import { Observable } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { AbstractFormDirective } from '../../../classes/abstract-form.directive';
import { ErrorMatcher } from '../../../classes/error-matcher';
import { IAssignment } from '../../../models/assignment';
import { IContest } from '../../../models/contest';
import { IProblem } from '../../../models/problem';
import { AssignmentService } from '../../../services/apis/assignment.service';
import { ContestService } from '../../../services/apis/contest.service';
import { ProblemService } from '../../../services/apis/problem.service';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'sw-problem-form-page',
  templateUrl: './problem-form-page.component.html',
  styleUrls: ['./problem-form-page.component.scss'],
})
export class ProblemFormPageComponent extends AbstractFormDirective<IProblem, string> implements OnInit {
  contest: IContest;
  assignment: IAssignment;
  errorMatcher = new ErrorMatcher(this.submitted$, this.submissionError$);

  constructor(
    public auth: AuthService,
    public layout: LayoutService,
    private route: ActivatedRoute,
    private router: Router,
    private contestService: ContestService,
    private assignmentService: AssignmentService,
    private problemService: ProblemService,
    fb: FormBuilder
  ) {
    super(fb);
  }

  cancel(): void {
    
    if (this.modifying) {  
      if(this.contest){
        this.contest
          ? this.router.navigate(['/problem/detail', this.model._id], { queryParams: { contest: this.contest._id } })
          : this.router.navigate(['/problem/detail', this.model._id]);
      } else if(this.assignment) {
        this.contest
          ? this.router.navigate(['/problem/detail', this.model._id], { queryParams: { contest: this.assignment._id } })
          : this.router.navigate(['/problem/detail', this.model._id]);
      }
    } else {
      if(this.contest) {
        this.contest
          ? this.router.navigate(['/contest', this.contest._id, 'problems'])
          : this.router.navigateByUrl('/problem/list/me');
      } else if(this.assignment) {
        this.contest
          ? this.router.navigate(['/assignment', this.contest._id, 'problems'])
          : this.router.navigateByUrl('/problem/list/me');
      }
    }
  }

  async submit(): Promise<void> {
    await super.submit();
  }

  protected async processAfterSubmission(s: string): Promise<void> {
    let params: any;
    this.route.queryParams.subscribe(res => { params = res; });
    if (params.contest) {
      await this.router.navigate(['/contest', params.contest._id, 'problems']);
    } else if (params.assignment) {
      await this.router.navigate(['/assignment', params.assignment._id, 'problems']);
    } else {
      await this.router.navigateByUrl('/problem/list');
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
    let params: any;
    this.route.queryParams.subscribe(res => {params = res})
    if (params.contest) {
      observable = this.modifying
        ? this.problemService
            .updateProblem(this.model._id, { ...m, parentType: 'Contest', parent: params.contest._id })
          .pipe(map(() => params.contest._id))
        : this.problemService
          .createProblem({ ...m, parentType: 'Contest', parent: params.contest._id })
          .pipe(map(() => params.contest._id));
    } else if (params.assignment) {
      observable = this.modifying
        ? this.problemService
            .updateProblem(this.model._id, { ...m, parentType: 'Assignment', parent: params.assignment._id })
          .pipe(map(() => params.assignment._id))
        : this.problemService
          .createProblem({ ...m, parentType: 'Assignment', parent: params.assignment._id })
          .pipe(map(() => params.assignment._id));
    } else {
      observable = this.modifying
        ? this.problemService.updateProblem(this.model._id, m).pipe(map(() => this.model._id))
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
        .subscribe((res) => (this.contest = res.data)),

      this.route.queryParams
        .pipe(
          map((params) => params.assignment),
          filter((id) => !!id),
          switchMap((id) => this.assignmentService.getAssignment(id))
        )
        .subscribe((res) => (this.assignment = res.data))
      
      
    );
  }
}
