import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ERROR_CODES } from 'projects/main/src/app/constants/error-codes';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AbstractFormDirective } from '../../../../classes/abstract-form.directive';
import { ErrorMatcher } from '../../../../classes/error-matcher';
import { AuthService } from '../../../../services/auth.service';

interface ILoginObject {
  no: string;
  password: string;
}

@Component({
  selector: 'sw-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent extends AbstractFormDirective<ILoginObject, boolean> {

  errorMatcher = new ErrorMatcher(this.submitted$, this.submissionError$);
  joinPageUrl = environment.joinPageUrl;

  constructor(private auth: AuthService,
              fb: FormBuilder) {
    super(fb);

  }

  protected processSubmissionError(error: HttpErrorResponse): void {
        switch (error.error.code) {
          case ERROR_CODES.USER_NOT_FOUND:
            this.submissionError = {
              path: 'no',
              message: '등록되지 않은 사용자입니다.',
            };
            break;
          case ERROR_CODES.INVALID_PASSWORD:
            this.submissionError = {
              path: 'password',
              message: '잘못된 비밀번호입니다.',
            };
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
    return this.auth.login(no, password);
  }

}
