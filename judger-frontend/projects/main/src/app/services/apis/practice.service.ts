import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiBase } from '../../classes/api-base';
import { IParams } from '../../models/params';
import { IProblem } from '../../models/problem';
import { IListResponse, IResponse } from '../../models/response';
import { ISubmit } from '../../models/submit';

@Injectable({
  providedIn: 'root'
})
export class PracticeService extends ApiBase {

  constructor(private http: HttpClient) {
    super(environment.apiHost, '/practice');
  }

  search(params?: IParams): Observable<IListResponse<IProblem>> {
    return this.http.get<IListResponse<IProblem>>(this.url`/`, { params: ApiBase.params(params) });
  }

  getPractice(id?: string): Observable<IResponse<IProblem>> {
    return this.http.get<IResponse<IProblem>>(this.url`/${id}`);
  }

  registerPractice(m?: IProblem): Observable<IResponse<IProblem>> {
    return this.http.post<IResponse<IProblem>>(this.url`/`, m);
  }

  updatePractice(m?: IProblem, id?: string): Observable<IResponse<undefined>> {
    return this.http.patch<IResponse<undefined>>(this.url`/${id}`, m);
  }

  removePractice(id?: string): Observable<IResponse<undefined>> {
    return this.http.delete<IResponse<undefined>>(this.url`/${id}`);
  }

  submit(m?: ISubmit, id?: string): Observable<IResponse<ISubmit>> {
    return this.http.post<IResponse<ISubmit>>(this.url`/${id}/submit`, m);
  }

  getMyPracticeSubmits(id?: string): Observable<IListResponse<ISubmit>> {
    return this.http.get<IListResponse<ISubmit>>(this.url`/${id}/my-submits`);
  }

  getPracticeSubmitsDetail(id?:string): Observable<IResponse<ISubmit>> {
    return this.http.get<IResponse<ISubmit>>(this.url`/${id}/submit/detail`);
  }

}
