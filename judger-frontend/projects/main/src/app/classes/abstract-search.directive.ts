import { Directive, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, shareReplay } from 'rxjs/operators';
import { IParams } from '../models/params';
import { IListResponse } from '../models/response';

@Directive()
export abstract class AbstractSearchDirective<T> implements OnInit, OnDestroy {
  private subscription: Subscription;
  private sortSubject: BehaviorSubject<string> = new BehaviorSubject(null);

  protected response: IListResponse<T>;
  protected searchProperties: string;

  loading: boolean;
  params: IParams;
  formGroup: FormGroup;
  sort$: Observable<string> = this.sortSubject.asObservable().pipe(filter(sort => !!sort));

  protected constructor(params: IParams = {},
                        searchProperties: Array<keyof T | string> = [],
                        protected route: ActivatedRoute = null,
                        protected router: Router = null,
                        private typingSearch: boolean = true,
                        private mapKeyword = (k: string): string => k) {

    if (!!this.route ? !this.router : !!this.router) {
      throw new Error('route and router must be asigned together');
    }

    this.params = { page: 1, ...params };
    this.searchProperties = searchProperties.join(',');
    this.formGroup = new FormGroup({
      keyword: new FormControl(null)
    });
  }

  get documents(): Array<T> {
    return this.response ? this.response.data.documents : [];
  }

  get total(): number {
    return this.response ? this.response.data.total : 0;
  }

  get page(): number {
    return this.params.page;
  }

  set limit(limit: number) {
    this.params.limit = limit;
  }

  get limit(): number {
    return this.params.limit;
  }

  set keyword(keyword: string) {
    keyword = (keyword || '').trim();

    if (!keyword) {
      delete this.params.q;
    } else if (this.searchProperties) {
      keyword ? this.params.q = `${this.searchProperties}=${keyword}` : delete this.params.q;
    } else {
      this.params.q = keyword;
    }
    keyword ? this.keywordControl.setValue(keyword) : this.keywordControl.reset();
  }

  get keyword(): string {
    const q = this.params.q ? this.params.q.split('=') : [];
    return q.length > 0 ? q[q.length - 1] : null;
  }

  get emptyDocuments(): boolean {
    return !this.keyword && this.total === 0;
  }

  get emptySearchResults(): boolean {
    return this.keyword && this.total === 0;
  }

  get keywordControl(): FormControl {
    return this.formGroup.get('keyword') as FormControl;
  }

  getNo(index: number): number {
    return (index + 1) + (this.page - 1) * this.limit;
  }

  search(page: number = 1, keyword?: string): void {

    if (!this.typingSearch) {
      // 검색 버튼을 눌러 검색할 경우 값의 변화를 구독하지 않으므로 직접 keyword를 설정
      keyword = this.mapKeyword(this.keywordControl.value);
    }

    if (keyword !== this.keyword) {
      this.params.page = 1;
      this.keyword = keyword;
    } else {
      this.params.page = page;
    }


    if (this.router) {

      const queryParams = {
        ...this.params,
        page: this.page,
        limit: this.limit,
        q: this.keyword
      };

      const url = this.router.url.split('?')[0];
      this.router.navigate([url], { queryParams });
    } else {
      this._request();
    }
  }

  reload(): void {
    this.search(this.page, this.keyword);
  }

  pagination(page: number): void {
    this.search(page, this.keyword);
  }

  getMore(): void {
    if (!this.route) {
      this.params.page++;
      this.loading = true;
      this.requestObservable(this.params).pipe(
        shareReplay(),
        finalize(() => this.loading = false)
      ).subscribe(res => {
        this.response.data.documents = [...this.response.data.documents, ...res.data.documents];
        this.sortSubject.next(this.params.sort);
      });
    }
  }

  protected abstract requestObservable(params?: IParams): Observable<IListResponse<T>>;

  protected addSubscriptions(...subscriptions: Subscription[]): void {
    subscriptions.forEach(subscription => {
      if (this.subscription) {
        this.subscription.add(subscription);
      } else {
        this.subscription = subscription;
      }
    });
  }

  private _request(): void {
    this.loading = true;
    this.requestObservable(this.params).pipe(
      shareReplay(),
      finalize(() => this.loading = false)
    ).subscribe(
      res => {
        this.response = res;
        this.sortSubject.next(this.params.sort);
      },
    );
  }

  ngOnInit(): void {

    if (!this.route) {
      this.search();
    }


    if (this.typingSearch) {
      this.addSubscriptions(
        this.keywordControl.valueChanges.pipe(
          debounceTime(500),
          map(this.mapKeyword),
          distinctUntilChanged()
        ).subscribe(keyword => this.search(this.page, keyword))
      );
    }

    if (this.route) {
      this.addSubscriptions(
        this.route.queryParams.subscribe(
          params => {
            params = { ...params };
            this.keyword = params.q || '';
            this.params.page = +(params.page || 1);
            const limit = +params.limit;

            if (!isNaN(limit)) {
              this.params.limit = limit;
            }

            delete params.q;
            this.params = { ...this.params, ...params };
            this._request();
          }
        )
      );
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
