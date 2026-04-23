import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1/auth';
  
    login(data: { username: string; password: string }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/login`,
      data,
      {
        withCredentials: true,
        responseType: 'text' as 'json'
      }
    );
  }

    register(data: { username: string; password: string }): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/register`,
      data,
      {
        withCredentials: true,
        responseType: 'text' as 'json'
      }
    );
  }

  refresh(): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/refresh`,
      {},
      {
        withCredentials: true,
        responseType: 'text' as 'json'
      }
    );
  }
}
