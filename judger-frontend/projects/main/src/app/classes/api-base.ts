import { environment } from '../../environments/environment';
import { RequestBase } from './request-base';

export class ApiBase extends RequestBase {
  constructor(baseUrl: string,
              basePath: string) {
    super(baseUrl);
    this.baseUrl = `${this.baseUrl}/${environment.apiVersion}${basePath}`;
  }
}
