import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RequestBase } from '../classes/request-base';
import { IResponse, IUploadResponse } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class UploadService extends RequestBase {
  constructor(private http: HttpClient) {
    super(environment.apiHost);
  }

  upload(file: File): Observable<IUploadResponse> {
    const formData = new FormData();
    formData.append('upload', file);
    return this.http.post(this.url`/upload`, formData);
  }

  removeFileByUrl(url: string): Observable<IResponse<undefined>> {
    return this.http.delete<IResponse<undefined>>(this.url`/`, { params: RequestBase.params({ url }) });
  }

  removeFileById(id: string): Observable<IResponse<undefined>> {
    return this.http.delete<IResponse<undefined>>(this.url`/${id}`);
  }
}
