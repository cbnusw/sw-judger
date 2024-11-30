import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiBase } from '../../classes/api-base';
import { IParams } from '../../models/params';
import { IListResponse, IResponse } from '../../models/response';
import { ISubmit } from '../../models/submit';

@Injectable({
  providedIn: 'root',
})
export class SubmitService extends ApiBase {
  constructor(private http: HttpClient) {
    super(environment.apiHost, '/submit');
  }

  getSubmits(params?: IParams): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/`, {
      params: ApiBase.params(params),
    });
  }

  getSubmit(id: string): Observable<IResponse<ISubmit>> {
    return this.http.get<IResponse<ISubmit>>(this.url`/${id}`);
  }

  getMySubmits(params?: IParams): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/me`, {
      params: ApiBase.params(params),
    });
  }

  getContestSubmits(id: string, params?: IParams): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/contest/${id}`, {
      params: ApiBase.params(params),
    });
  }

  getMyContestSubmits(id: string): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/contest/${id}/me`);
  }

  getMyAssignmentSubmits(id: string): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(
      this.url`/assignment/${id}/me`
    );
  }

  getAssignmentSubmits(id: string, params?: IParams): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/assignment/${id}`, {
      params: ApiBase.params(params),
    });
  }

  getProblemSubmits(id: string): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/problem/${id}`);
  }

  getMyProblemSubmits(id: string): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/problem/${id}/me`);
  }
}
