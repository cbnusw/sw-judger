import { HttpErrorResponse } from '@angular/common/http';
import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

export interface SubmissionError {
  path?: Array<string> | string;
  message?: string;
}

@Directive()
export abstract class AbstractFormDirective<M, S> implements OnInit, OnDestroy {

  private modelSubject: BehaviorSubject<M> = new BehaviorSubject(null);
  private submissionErrorSubject: BehaviorSubject<SubmissionError> = new BehaviorSubject({});
  private submittedSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  protected subscription: Subscription;

  loading: boolean;
  formGroup: FormGroup;

  model$: Observable<M> = this.modelSubject.asObservable();
  submitted$: Observable<boolean> = this.submittedSubject.asObservable();
  submissionError$: Observable<SubmissionError> = this.submissionErrorSubject.asObservable();

  @Output() modelChange: EventEmitter<M> = new EventEmitter();

  protected constructor(
    private formBuilder: FormBuilder,
    private inOnInit: boolean = false,
    private aggresiveErrorMessagse: boolean = false,
  ) {
    if (!this.inOnInit) {
      this.formGroup = this.initFormGroup(this.formBuilder);
    }
  }

  @Input() set model(m: M) {
    this.modelSubject.next(m);
  }

  get model(): M {
    return this.modelSubject.value;
  }

  get modifying(): boolean {
    return !!this.model;
  }

  set submitted(submitted: boolean) {
    this.submittedSubject.next(submitted);
  }

  get submitted(): boolean {
    return this.submittedSubject.value;
  }

  set submissionError(error: SubmissionError) {
    this.submissionErrorSubject.next(error);
  }

  get submissionError(): SubmissionError {
    return this.submissionErrorSubject.value;
  }

  get submissionErrorMessage(): string {
    return this.submissionError.message;
  }

  async isInvalidForm(): Promise<boolean> {
    return this.formGroup.invalid;
  }

  hasSubmissionError(path?: Array<string> | string): boolean {
    if (!this.submissionError.message) {
      return false;
    }

    if (!path && !this.submissionError.path) {
      return true;
    }

    if (Array.isArray(this.submissionError.path) && Array.isArray(path)) {
      return this.submissionError.path.join('.') === path.join('.');
    } else {
      return this.submissionError.path === path;
    }
  }

  hasError(errorCode: string, path?: Array<string> | string): boolean {
    if (this.aggresiveErrorMessagse) {
      return this.formGroup.hasError(errorCode, path);
    }
    return this.submitted && this.formGroup.hasError(errorCode, path);
  }

  invalid(path?: Array<string> | string): boolean {
    if (!this.submitted) {
      return false;
    }

    try {
      return this.hasSubmissionError(path) || (path ? this.formGroup.get(path).invalid : this.formGroup.invalid);
    } catch (err) {
      console.error(err);
      return true;
    }
  }

  reset(): void {
    this.formGroup.reset();
    this.model = null;
    this.modelChange.emit(null);
  }

  async submit(): Promise<void> {
    this.submitted = true;

    if (await this.isInvalidForm()) {
      return;
    }

    this.loading = true;
    const model = await this.mapToModel(this.formGroup.getRawValue());

    this.submitObservable(model).pipe(
      finalize(() => this.loading = false)
    ).subscribe(
      s => this.processAfterSubmission(s),
      err => this.processSubmissionError(err)
    );
  }

  protected abstract initFormGroup(formBuilder: FormBuilder): FormGroup;
  protected abstract submitObservable(m: M): Observable<S>;

  protected initSubmission(): void {
    this.submitted = false;
    this.submissionError = {};
  }

  protected patchFormGroup(m: M): void {
    this.formGroup.patchValue(m);
  }

  protected async mapToModel(m: M): Promise<M> {
    return m;
  }

  protected async processAfterSubmission(s: S): Promise<void> {
    this.reset();
  }

  protected processSubmissionError(error: HttpErrorResponse): void {
    console.error(error);
  }

  protected addSubcription(...subscriptions: Subscription[]): void {
    subscriptions.forEach(subscription => {
      if (this.subscription) {
        this.subscription.add(subscription);
      } else {
        this.subscription = subscription;
      }
    });
  }


  ngOnInit(): void {
    if (this.inOnInit) {
      this.formGroup = this.initFormGroup(this.formBuilder);
    }

    this.addSubcription(
      this.formGroup.valueChanges.subscribe(() => this.initSubmission()),

      this.model$.subscribe(model => {
        if (model) {
          this.patchFormGroup(model);
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
