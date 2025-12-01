import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable()
export class ApiHttpInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modifiedRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'CF-Access-Client-Id': environment.cfAccessClientId,
        'CF-Access-Client-Secret': environment.cfAccessClientSecret
      }
    });

    return next.handle(modifiedRequest).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        return throwError(() => new Error(`Erreur HTTP ${error.status}: ${error.statusText}`));
      })
    );
  }
}