import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth, CreateAccount, Response } from '../../types';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(account: CreateAccount): Observable<Response<Auth>> {
    return this.http.post<Response<Auth>>(
      `${environment.apiUrl}/api/v1/auth/login`,
      account
    );
  }
}
