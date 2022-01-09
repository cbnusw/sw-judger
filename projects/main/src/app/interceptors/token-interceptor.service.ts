import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, StorageService, TOKEN_FLUSH_EVENT } from '../services/storage.service';
import { ERROR_CODES } from '../constants/error-codes';
import { environment } from '../../environments/environment';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    request = this.addToken(request);

    return next.handle(request).pipe(
      catchError(err => {
        if (err.error && err.error.code === ERROR_CODES.ACCESS_TOKEN_EXPIRED) {
          return this.refreshToken(request, next);
        }
        return throwError(err);
      }),
      catchError(err => {
        const { status } = (err || {}).error || (err || {});
        if (status === 401 || status === 401) {
          const loginPageUrl = environment.loginPageUrl;
          this.storageService.clear();
          this.storageService.emit(TOKEN_FLUSH_EVENT);
          loginPageUrl.startsWith('/') ? this.router.navigateByUrl(loginPageUrl) : location.href = loginPageUrl;
        }
        return throwError(err);
      })
    );
  }

  private addToken(request: HttpRequest<any>): HttpRequest<any> {
    const token: string = this.storageService.get(ACCESS_TOKEN_KEY);
    return token ? request.clone({ setHeaders: { 'x-access-token': token } }) : request;
  }

  private refreshToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const url = `${environment.authHost}/token/refresh`;

      return from(
        fetch(url, {
          method: 'GET',
          headers: {
            'x-refresh-token': this.storageService.get(REFRESH_TOKEN_KEY)
          }
        }).then(res => res.json())
      ).pipe(
        switchMap(res => {
          const { accessToken, refreshToken } = res.data;
          this.storageService.set(ACCESS_TOKEN_KEY, accessToken);
          this.storageService.set(REFRESH_TOKEN_KEY, refreshToken);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(accessToken);
          return next.handle(this.addToken(request));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => !!token),
        take(1),
        switchMap(() => next.handle(this.addToken(request)))
      );
    }
  }
}
