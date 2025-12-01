import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from '../environments/environment';

export const apiHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedRequest = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'CF-Access-Client-Id': environment.cfAccessClientId,
      'CF-Access-Client-Secret': environment.cfAccessClientSecret
    }
  });

  return next(modifiedRequest).pipe(
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
};