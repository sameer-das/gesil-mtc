import { HttpErrorResponse, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { catchError, filter, switchMap, take, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { MessageDuaraion, MessageSeverity } from '../../models/config.enum';



export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);

  const accessToken = authService.getAccessToken();
  let authReq = req;

  console.log('Inside Auth Interceptor URL :: ' + authReq.url);

  if (accessToken) {
    authReq = addToken(req, accessToken);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !authReq.url.includes('/Auth/refresh') &&
        !authReq.url.includes('/Auth/login')
      ) {
        return handle401Error(authService, authReq, next);
      } else {
        return handleOtherHttpError(error, messageService);
      }
    })
  );

};



const addToken = (request: HttpRequest<any>, token: string) => {
  return request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}



const handle401Error = (authService: AuthService, request: HttpRequest<any>, next: HttpHandlerFn) => {
  console.log('Inside Handle401Error')
  if (!authService.refreshTokenInProgress) {
    authService.refreshTokenInProgress = true;
    authService.getRefreshTokenSubject().next(null);

    return authService.refreshToken().pipe(
      switchMap((token) => {
        authService.refreshTokenInProgress = false;
        authService.getRefreshTokenSubject().next(token.accessToken);
        return next(addToken(request, token.accessToken));
      }),
      catchError((err) => {
        authService.refreshTokenInProgress = false;
        return throwError(() => err);
      })
    );
  } else {
    return authService.getRefreshTokenSubject().pipe(
      filter((token) => token != null),
      take(1),
      switchMap((token) =>
        next(addToken(request, token as string))
      )
    );
  }
}



const handleOtherHttpError = (error: HttpErrorResponse, messageService: MessageService) => {
  let errorMessage = 'An unknown error occurred';
  if (error.error instanceof ErrorEvent) {
    // Client-side/network error
    errorMessage = `Client Error: ${error.error.message}`;
  } else {
    // Server-side error
    errorMessage = `Error ${error.status}: ${error.message}`;

    // Handle specific status codes
    switch (error.status) {
      case 400:
        errorMessage = 'Bad Request';
        break;
      case 401:
        errorMessage = 'Unauthorized - Please login again.';
        break;
      case 403:
        errorMessage = 'Forbidden - You don’t have permission.';
        break;
      case 404:
        errorMessage = 'Resource not found';
        break;
      case 500:
        errorMessage = 'Internal Server Error';
        break;
    }
  }

  messageService.add({ severity: MessageSeverity.ERROR, summary: 'Http Error', detail: errorMessage, life: MessageDuaraion.LONG })

  return throwError(() => error);
}