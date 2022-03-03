import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiBase } from '../../classes/api-base';
import { IListResponse } from '../../models/response';
import { ISubmit } from '../../models/submit';

@Injectable({
  providedIn: 'root',
})
export class SubmitService extends ApiBase {
  constructor(private http: HttpClient) {
    super(environment.apiHost, '/submit');
  }

  getSubmits(): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/`);
  }

  getMySubmits(): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/me`);
  }

  getContestSubmits(id: string): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/contest/${id}`);
  }

  getMyContestSubmits(id: string): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/contest/${id}/me`);
  }
  getMyAssignmentSubmits(id: string): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/assignment/${id}/me`);
  }
  getProblemSubmits(id: string): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/problem/${id}`);
  }

  getMyProblemSubmits(id: string): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/problem/${id}/me`);
  }
}
