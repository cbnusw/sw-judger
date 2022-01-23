import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiBase } from '../../classes/api-base';
import { IAssignment } from '../../models/assignment';
import { IParams } from '../../models/params';
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

  updateAssignment(
    id: string,
    body: IAssignment
  ): Observable<IResponse<undefined>> {
    return this.http.put<IResponse<undefined>>(this.url`/${id}`, body);
  }

  removeAssignment(id: string): Observable<IResponse<undefined>> {
    return this.http.delete<IResponse<undefined>>(this.url`/${id}`);
  }
}
