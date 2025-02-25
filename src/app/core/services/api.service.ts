import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { IDogInformation, VotePayload } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getDogInformationList(limit: number = 10): Observable<IDogInformation[]> {
    const url = this.baseUrl + `/images/search?limit=${limit}`;
    return this.http
      .get<IDogInformation[]>(url)
      .pipe(catchError(this.handleError));
  }

  getSpecificDog(id: string): Observable<IDogInformation> {
    const url = this.baseUrl + `/images/${id}`;
    return this.http
      .get<IDogInformation>(url)
      .pipe(catchError(this.handleError));
  }

  getDogDetails(id: string) {
    const url = this.baseUrl + `/breeds/${id}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  voteDog(payload: VotePayload) {
    const url = this.baseUrl + `/votes`;
    return this.http.post(url, payload).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong!'));
  }
}
