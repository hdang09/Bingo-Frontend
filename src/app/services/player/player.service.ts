import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Player, Response } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  constructor(private http: HttpClient) {}

  getMyInfo() {
    const token = localStorage.getItem('token');
    return this.http.get<Response<Player>>(
      `${environment.apiUrl}/api/v1/player/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
