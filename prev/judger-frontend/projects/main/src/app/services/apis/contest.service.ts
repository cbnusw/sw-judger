import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { any } from 'codelyzer/util/function';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiBase } from '../../classes/api-base';
import { IContest } from '../../models/contest';
import { IParams } from '../../models/params';
import { IProblem } from '../../models/problem';
import { IListResponse, IResponse } from '../../models/response';

@Injectable({
  providedIn: 'root',
})
export class ContestService extends ApiBase {
  constructor(private http: HttpClient) {
    super(environment.apiHost, '/contest');
  }

  search(params?: IParams): Observable<IListResponse<IContest>> {
    return this.http.get<IListResponse<IContest>>(this.url`/`, {
      params: ApiBase.params(params),
    });
  }

  searchMyContests(params?: IParams): Observable<IListResponse<IContest>> {
    return this.http.get<IListResponse<IContest>>(this.url`/me`, {
      params: ApiBase.params(params),
    });
  }

  getRegisteredContests(params?: IParams): Observable<IListResponse<IContest>> {
    return this.http.get<IListResponse<IContest>>(this.url`/registered`, {
      params: ApiBase.params(params),
    });
  }

  getApplyingContests(): Observable<IListResponse<IContest>> {
    return this.http.get<IListResponse<IContest>>(this.url`/applying`);
  }

  getProgressingContests(): Observable<IListResponse<IContest>> {
    return this.http.get<IListResponse<IContest>>(this.url`/progressing`);
  }

  getContest(id: string): Observable<IResponse<IContest>> {
    return this.http.get<IResponse<IContest>>(this.url`/${id}`);
  }

  getContestForAdmin(id: string): Observable<IResponse<IContest>> {
    return this.http.get<IResponse<IContest>>(this.url`/admin/${id}`);
  }

  getContestProblems(id: string): Observable<IResponse<IContest>> {
    return this.http.get<IResponse<IContest>>(this.url`/${id}/problems`);
  }

  getMyEnrollContests(): Observable<IResponse<undefined>> {
    return this.http.get<IResponse<undefined>>(this.url`/enroll/me`);
  }

  confirmPassword(id: string, pwd: string): Observable<IResponse<any>> {
    return this.http.get<IResponse<any>>(this.url`/confirm/${id}`, {
      params: { password: pwd },
    });
  }

  createContest(body: IContest): Observable<IResponse<IContest>> {
    return this.http.post<IResponse<IContest>>(this.url`/`, body);
  }

  createContestProblem(
    id: string,
    body: IProblem
  ): Observable<IResponse<IProblem>> {
    return this.http.post<IResponse<IProblem>>(this.url`/${id}/problem`, body);
  }

  enrollContest(id: string): Observable<IResponse<undefined>> {
    return this.http.post<IResponse<undefined>>(this.url`/${id}/enroll`, null);
  }

  unenrollContest(id: string): Observable<IResponse<undefined>> {
    return this.http.post<IResponse<undefined>>(
      this.url`/${id}/unenroll`,
      null
    );
  }

  updateContest(id: string, body: IContest): Observable<IResponse<undefined>> {
    return this.http.put<IResponse<undefined>>(this.url`/${id}`, body);
  }

  updateContestProblem(
    id: string,
    problemId: string,
    body: IProblem
  ): Observable<IResponse<undefined>> {
    console.log('updated!');
    return this.http.put<IResponse<undefined>>(
      this.url`/${id}/problem/${problemId}`,
      body
    );
  }

  reorderContestProblems(
    id: string,
    problems: IProblem[]
  ): Observable<IResponse<undefined>> {
    return this.http.patch<IResponse<undefined>>(
      this.url`/${id}/problem/reorder`,
      { problems }
    );
  }

  removeContest(id: string): Observable<IResponse<undefined>> {
    return this.http.delete<IResponse<undefined>>(this.url`/${id}`);
  }

  exitContest(contestId: string): Observable<IResponse<undefined>> {
    return this.http.put<IResponse<undefined>>(
      this.url`/${contestId}/problems`,
      {}
    );
  }
}
