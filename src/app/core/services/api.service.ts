import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, ErrorResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, { params })
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}${endpoint}`, data)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.baseUrl}${endpoint}`)
      .pipe(
        map(response => response.data),
        catchError(this.handleError)
      );
  }

  private handleError = (error: any): Observable<never> => {
    let errorMessage = 'Ha ocurrido un error inesperado';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || error.message || errorMessage;
    }
    
    return throwError(() => new Error(errorMessage));
  };
}
