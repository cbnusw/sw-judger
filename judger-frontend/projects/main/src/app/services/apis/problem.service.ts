import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiBase } from '../../classes/api-base';
import { IParams } from '../../models/params';
import { IProblem } from '../../models/problem';
import { IListResponse, IResponse } from '../../models/response';
import { ISubmit } from '../../models/submit';

@Injectable({
  providedIn: 'root',
})
export class ProblemService extends ApiBase {
  constructor(private http: HttpClient) {
    super(environment.apiHost, '/problem');
  }

  search(params?: IParams): Observable<IListResponse<IProblem>> {
    return this.http.get<IListResponse<IProblem>>(this.url`/`, { params: ApiBase.params(params) });
  }

  getProblem(id: string): Observable<IResponse<IProblem>> {
    return this.http.get<IResponse<IProblem>>(this.url`/${id}`);
  }

  getProblems(params?: IParams): Observable<IListResponse<IProblem>> {
    return this.http.get<IListResponse<IProblem>>(this.url`/`, { params: ApiBase.params(params) });
  }

  createProblem(body: IProblem): Observable<IResponse<IProblem>> {
    return this.http.post<IResponse<IProblem>>(this.url`/`, body);
  }

  submit(id: string, body: ISubmit): Observable<IResponse<undefined>> {
    return this.http.post<IResponse<undefined>>(this.url`/${id}/submit`, body);
  }

  updateProblem(id: string, body: IProblem): Observable<IResponse<undefined>> {
    return this.http.put<IResponse<undefined>>(this.url`/${id}`, body);
  }

  updateContestProblem(problemId: string, body: IProblem): Observable<IResponse<undefined>> {
    console.log('updated!');
    return this.http.put<IResponse<undefined>>(this.url`/${problemId}`, body);
  }

  removeProblem(id: string): Observable<IResponse<undefined>> {
    return this.http.delete<IResponse<undefined>>(this.url`/${id}`);
  }

  getDownloadUrl(problemId: string, fileId: string): string {
    // 백엔드에서 제공하는 파일 다운로드 URL 생성
    return `${this.url`/${problemId}/example-files/${fileId}`}`;
  }
}
