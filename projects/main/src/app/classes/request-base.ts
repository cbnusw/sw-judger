import { HttpParams } from '@angular/common/http';
import { IParams } from '../models/params';

export class RequestBase {
  constructor(protected baseUrl: string) {}

  protected static params(params?: IParams): HttpParams {
    const keys = Object.keys(params || {});
    return keys.reduce((p, key) => p.set(key, String(params[key])), new HttpParams());
  }

  protected url(s: any, ...args: any): string {
    console.log(s, args);
    return s.reduce((p, c, i) => p + s[i] + (args[i] || ''), this.baseUrl);
  }
}
