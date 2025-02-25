import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { IDogInformation } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getDogImages(): Observable<IDogInformation[]> {
    const url = this.baseUrl + `/images/search?limit=1`;
    return this.http
      .get<IDogInformation[]>(url)
      .pipe(catchError(this.handleError));
  }

  getDogDetails(id: string): Observable<any> {
    const url = this.baseUrl + `/breeds/${id}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong!'));
  }
}
