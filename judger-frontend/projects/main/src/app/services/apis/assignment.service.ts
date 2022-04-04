import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiBase } from '../../classes/api-base';
import { IAssignment } from '../../models/assignment';
import { IParams } from '../../models/params';
import { IProblem } from '../../models/problem';
import { IListResponse, IResponse } from '../../models/response';
import { ISubmit } from '../../models/submit';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService extends ApiBase {
  constructor(private http: HttpClient) {
    super(environment.apiHost, '/assignment');
  }

  search(params?: IParams): Observable<IListResponse<IAssignment>> {
    return this.http.get<IListResponse<IAssignment>>(this.url`/`, {
      params: ApiBase.params(params),
    });
  }

  searchMyAssignments(params?: IParams): Observable<IListResponse<IAssignment>> {
    return this.http.get<IListResponse<IAssignment>>(this.url`/me`, {
      params: ApiBase.params(params),
    });
  }

  getAssignment(id: string): Observable<IResponse<IAssignment>> {
    return this.http.get<IResponse<IAssignment>>(this.url`/${id}`);
  }

  getAssignments(params?: IParams): Observable<IListResponse<IAssignment>> {
    return this.http.get<IListResponse<IAssignment>>(this.url`/`, {
      params: ApiBase.params(params),
    });
  }

  createAssignment(body: IAssignment): Observable<IResponse<IAssignment>> {
    return this.http.post<IResponse<IAssignment>>(this.url`/`, body);
  }

  submit(id: string, body: ISubmit): Observable<IResponse<undefined>> {
    return this.http.post<IResponse<undefined>>(this.url`/${id}/submit`, body);
  }

  updateAssignment(id: string, body: IAssignment): Observable<IResponse<undefined>> {
    return this.http.put<IResponse<undefined>>(this.url`/${id}`, body);
  }

  removeAssignment(id: string): Observable<IResponse<undefined>> {
    return this.http.delete<IResponse<undefined>>(this.url`/${id}`);
  }

  getAssignmentProblems(id: string): Observable<IResponse<IAssignment>> {
    return this.http.get<IResponse<IAssignment>>(this.url`/${id}/problems`);
  }

  reorderAssignmentProblems(id: string, problems: IProblem[]): Observable<IResponse<undefined>> {
    return this.http.patch<IResponse<undefined>>(this.url`/${id}/problem/reorder`, { problems });
  }

  enrollAssignment(id: string): Observable<IResponse<undefined>> {
    return this.http.post<IResponse<undefined>>(this.url`/${id}/enroll`, null);
  }

  unenrollAssignment(id: string): Observable<IResponse<undefined>> {
    return this.http.post<IResponse<undefined>>(this.url`/${id}/unenroll`, null);
  }

  createAssignmentProblem(id: string, body: IProblem): Observable<IResponse<IProblem>> {
    return this.http.post<IResponse<IProblem>>(this.url`/${id}/problem`, body);
  }

  updateAssignmentProblem(id: string, problemId: string, body: IProblem): Observable<IResponse<undefined>> {
    console.log('updated!');
    return this.http.put<IResponse<undefined>>(this.url`/${id}/problem/${problemId}`, body);
  }
}
