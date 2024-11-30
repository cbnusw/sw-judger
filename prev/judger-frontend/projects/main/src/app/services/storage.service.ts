import { Injectable } from '@angular/core';

export const REFRESH_TOKEN_KEY = 'refresh-token';
export const ACCESS_TOKEN_KEY = 'access-token';
export const REDIRECT_URL_KEY = 'redirect-url';

export const REQUEST_SHARE_TOKEN_EVENT = 'REQUEST_SHARE_TOKEN';
export const TOKEN_SHARE_EVENT = 'TOKEN_SHARE';
export const TOKEN_FLUSH_EVENT = 'TOKEN_FLUSH';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = sessionStorage;

  constructor() {
    this.init();
  }

  set redirectUrl(url: string) {
    this.set(REDIRECT_URL_KEY, url);
  }

  get redirectUrl(): string {
    const url: string = this.get(REDIRECT_URL_KEY);
    this.remove(REDIRECT_URL_KEY);
    return url;
  }

  get<R>(key: string): R {
    const value = this.storage.getItem(key);
    return value ? JSON.parse(value) : undefined;
  }

  set<T>(key: string, value: T): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }

  emit(eventName: string, data?: any): void {
    localStorage.setItem(eventName, JSON.stringify(data || null));
    localStorage.removeItem(eventName);
  }

  private init(): void {
    window.addEventListener(
      'storage',
      (event: StorageEvent) => {
        const refreshToken = this.get(REFRESH_TOKEN_KEY);
        const accessToken = this.get(ACCESS_TOKEN_KEY);

        if (event.key === REQUEST_SHARE_TOKEN_EVENT && refreshToken && accessToken) {
          this.emit(TOKEN_SHARE_EVENT, { accessToken, refreshToken });
        } else if (event.key === TOKEN_SHARE_EVENT && !(refreshToken || accessToken)) {
          const data = JSON.parse(event.newValue);
          this.set(REFRESH_TOKEN_KEY, data.refreshToken);
          this.set(ACCESS_TOKEN_KEY, data.accessToken);
          location.reload();
        } else if (event.key === TOKEN_FLUSH_EVENT) {
          this.clear();
        }
      },
      false
    );

    this.emit(REQUEST_SHARE_TOKEN_EVENT);
  }
}
