import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'secure'
})
export class SecurePipe implements PipeTransform {

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  // transform(url: string): Observable<SafeResourceUrl> {
  transform(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      // map(val => this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(val)))
      map(val => URL.createObjectURL(val))
    );
  }
}
