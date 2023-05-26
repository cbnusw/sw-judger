import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RequestBase } from '../classes/request-base';
import { IAuthenticationTokens } from '../models/authentication-tokens';
import { IResponse } from '../models/response';
import { IUserInfo } from '../models/user-info';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  StorageService,
  TOKEN_FLUSH_EVENT,
  TOKEN_SHARE_EVENT
} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RequestBase {

  private meSubject: BehaviorSubject<IUserInfo> = new BehaviorSubject(null);
  me$: Observable<IUserInfo> = this.meSubject.asObservable();

  constructor(
    private storageService: StorageService,
    private router: Router,
    private http: HttpClient,
  ) {
    super(environment.apiHost);
    if (this.loggedIn) {
      this.init();
    }
  }

  get loggedIn(): boolean {
    return !!this.storageService.get(ACCESS_TOKEN_KEY);
  }

  get me(): IUserInfo {
    return this.meSubject.value;
  }

  get isOperator(): boolean {
    const { role } = this.me || {};
    return role && ['admin', 'operator'].indexOf(role) !== -1;
  }

  get isOperator$(): Observable<boolean> {
    return this.me$.pipe(
      map(me => {
        const { role } = this.me || {};
        return role && ['admin', 'operator'].indexOf(role) !== -1;
      })
    );
  }

  get hasJudgePermission(): boolean {
    const { role, permissions } = this.me || {};
    if (role && ['admin', 'operator'].indexOf(role) !== -1) {
      return true;
    }
    return (permissions || []).indexOf('judge') !== -1;
  }

  get hasJudgePermission$(): Observable<boolean> {
    return this.me$.pipe(
      map(me => {
        const { role, permissions } = me || {};
        if (role && ['admin', 'operator'].indexOf(role) !== -1) {
          return true;
        }
        return (permissions || []).indexOf('judge') !== -1;
      })
    );
  }

  login(no: string, password: string): Observable<boolean> {
    return this.http.post<IResponse<IAuthenticationTokens>>(this.url`/auth/login`, { no, password }).pipe(
      tap(res => {
        this.initTokens(res.data);
        this.init();
      }),
      map(res => res.success)
    );
  }

  logout(): void {
    const refreshToken: string = this.storageService.get(REFRESH_TOKEN_KEY);
    this.http.get(`${environment.authHost}/logout`, { headers: { 'x-refresh-token': refreshToken } }).subscribe(
      res => {
        this.router.navigateByUrl('/account/login')
      }, error => console.log(error)
    )
    this.clear();
  }

  getMe(): void {
    this.http.get<IResponse<IUserInfo>>(this.url`/auth/me`).subscribe(
      res => this.meSubject.next(res.data)
    );
  }


  private initTokens({ accessToken, refreshToken }: IAuthenticationTokens): void {
    this.storageService.set(ACCESS_TOKEN_KEY, accessToken);
    this.storageService.set(REFRESH_TOKEN_KEY, refreshToken);
    this.storageService.emit(TOKEN_SHARE_EVENT, { accessToken, refreshToken });
  }

  private init(): void {
    this.getMe();
  }

  private clear(): void {
    this.storageService.clear();
    this.storageService.emit(TOKEN_FLUSH_EVENT);
    this.meSubject.next(null);
  }
}
