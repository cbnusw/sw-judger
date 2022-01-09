import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AbstractFormDirective } from '../../../classes/abstract-form.directive';
import { ErrorMatcher } from '../../../classes/error-matcher';
import { ERROR_CODES } from '../../../constants/error-codes';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';

interface ILoginObject {
  no: string;
  password: string;
}

@Component({
  selector: 'sw-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent extends AbstractFormDirective<ILoginObject, boolean> {

  joinPageUrl = environment.joinPageUrl;
  errorMatcher = new ErrorMatcher(this.submitted$, this.submissionError$);

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    formBuilder: FormBuilder
  ) {
    super(formBuilder);
  }

  protected async processAfterSubmission(s: boolean): Promise<void> {
    const url = this.storageService.redirectUrl || '';
    url.startsWith('/') ? await this.router.navigateByUrl(url) : location.href = url;
  }

  protected processSubmissionError(error: HttpErrorResponse): void {
    switch (error.error.code) {
      case ERROR_CODES.USER_NOT_FOUND:
        this.submissionError = { path: 'no', message: '등록되지 않은 사용자입니다.' };
        break;
      case ERROR_CODES.INVALID_PASSWORD:
        this.submissionError = { path: 'password', message: '잘못된 비밀번호입니다.' };
        break;
    }
  }

  protected initFormGroup(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      no: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  protected submitObservable(m: ILoginObject): Observable<boolean> {
    const { no, password } = m;
    return this.authService.login(no, password);
  }
}
