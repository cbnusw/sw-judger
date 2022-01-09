import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiBase } from '../../classes/api-base';
import { IResponse } from '../../models/response';
import { IScoreBoard } from '../../models/score-board';

@Injectable({
  providedIn: 'root'
})
export class ScoreService extends ApiBase {

  constructor(private http: HttpClient) {
    super(environment.apiHost, '/score');
  }

  getContestScoreBoards(id: string): Observable<IResponse<IScoreBoard[]>> {
    return this.http.get<IResponse<IScoreBoard[]>>(this.url`/contest/${id}`);
  }
}
