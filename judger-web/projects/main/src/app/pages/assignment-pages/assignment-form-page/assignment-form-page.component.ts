import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { AbstractFormDirective } from '../../../classes/abstract-form.directive';
import { ErrorMatcher } from '../../../classes/error-matcher';
import { IAssignment } from '../../../models/assignment';
import { IProblem } from '../../../models/problem';
import { AssignmentService } from '../../../services/apis/assignment.service';
import { AuthService } from '../../../services/auth.service';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'sw-assignment-form-page',
  templateUrl: './assignment-form-page.component.html',
  styleUrls: ['./assignment-form-page.component.scss'],
})
export class AssignmentFormPageComponent
  extends AbstractFormDirective<IAssignment, string>
  implements OnInit
{
  protected submitObservable(m: IAssignment): Observable<string> {
    throw new Error('Method not implemented.');
  }
  assignment: IAssignment;
  errorMatcher = new ErrorMatcher(this.submitted$, this.submissionError$);

  constructor(
    public auth: AuthService,
    public layout: LayoutService,
    private route: ActivatedRoute,
    private router: Router,
    private AssignmentService: AssignmentService,
    fb: FormBuilder
  ) {
    super(fb);
  }

  cancel(): void {
    if (this.modifying) {
      this.assignment
        ? this.router.navigate(['/assignment/detail', this.model._id], {
            queryParams: { asssignment: this.assignment._id },
          })
        : this.router.navigate(['/assignment/detail', this.model._id]);
    } else {
      this.assignment
        ? this.router.navigate([
            '/assignment',
            this.assignment._id,
            'assignments',
          ])
        : this.router.navigateByUrl('/assignment/list/me');
    }
  }

  async submit(): Promise<void> {
    await super.submit();
  }

  protected async processAfterSubmission(s: string): Promise<void> {
    if (this.assignment) {
      await this.router.navigate([
        '/assignment',
        this.assignment._id,
        'problems',
      ]);
    } else {
      await this.router.navigateByUrl('/problem/list/me');
    }
  }

  protected async mapToModel(m: IProblem): Promise<IProblem> {
    if (m.published) {
      m.published = this.assignment ? this.assignment.deadline : new Date();
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

  // protected submitObservable(m: IProblem): Observable<string> {
  //   let observable: Observable<string>;

  //   if (this.assignment) {
  //     observable = this.modifying
  //       ? this.AssignmnetService.updateAssignmentProblem(
  //           this.assignment._id,
  //           this.model._id,
  //           m
  //         ).pipe(map(() => this.assignment._id))
  //       : this.contestService
  //           .createContestProblem(this.contest._id, m)
  //           .pipe(map(() => this.contest._id));
  //   } else {
  //     observable = this.modifying
  //       ? this.problemService
  //           .updateProblem(this.model._id, m)
  //           .pipe(map(() => this.model._id))
  //       : this.problemService.createProblem(m).pipe(map((res) => res.data._id));
  //   }

  //   return observable;
  // }

  ngOnInit(): void {
    super.ngOnInit();

    // this.addSubcription(
    //   this.route.params
    //     .pipe(
    //       map((params) => params.id),
    //       filter((id) => !!id),
    //       switchMap((id) => this.AssignmentService.get(id))
    //     )
    //     .subscribe((res) => (this.model = res.data)),

    //   this.route.queryParams
    //     .pipe(
    //       map((params) => params.AssignmentListPageComponent),
    //       filter((id) => !!id),
    //       switchMap((id) => this.AssignmentService.getAssignment(id))
    //     )
    //     .subscribe((res) => (this.Assignment = res.data))
    // );
  }
}
