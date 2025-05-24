import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  private http = inject(HttpClient);
  private router = inject(Router);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private refreshing = false;

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setTokens(access: string, refresh: string): void {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Navigate to login or handle logout
    this.router.navigate(['/login'])

  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    const accessToken = this.getAccessToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<any>(`${environment.API_URL}${environment.refreshToken}`, {
      accessToken,
      refreshToken
    }).pipe(
      tap((tokens) => {
        this.setTokens(tokens.accessToken, tokens.refreshToken);
        this.refreshTokenSubject.next(tokens.accessToken);
      }),
      catchError((err) => {
        console.log(err)
        this.logout();
        return throwError(() => err);
      })
    );
  }

  get refreshTokenInProgress(): boolean {
    return this.refreshing;
  }

  set refreshTokenInProgress(value: boolean) {
    this.refreshing = value;
  }

  getRefreshTokenSubject(): BehaviorSubject<string | null> {
    return this.refreshTokenSubject;
  }

}
