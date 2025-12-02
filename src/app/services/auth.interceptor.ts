import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const isAuthEndpoint = request.url.includes('/auth/login') || request.url.includes('/auth/register');
        if (isAuthEndpoint) {
          return throwError(() => error);
        }

        if (error.status === 401) {
          localStorage.removeItem('usuario');
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          console.error('No tienes permiso para acceder a este recurso.');
        } else if (error.status === 404) {
          console.error('Recurso no encontrado.');
        } else if (error.status === 500) {
          console.error('Error del servidor. Intenta más tarde.');
        } else if (error.status === 0) {
          console.error('Error de conexión. Verifica tu internet.');
        } else {
          const msg = error.error?.error || error.error?.message || 'Error en la petición';
          console.error(msg);
        }
        return throwError(() => error);
      })
    );
  }
}
