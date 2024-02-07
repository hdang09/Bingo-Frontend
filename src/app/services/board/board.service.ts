import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Response } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private http: HttpClient) {}

  getBoard() {
    const token = localStorage.getItem('token');

    return this.http.get<Response<number[][]>>(
      `${environment.apiUrl}/api/v1/board`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  callNumber() {
    const token = localStorage.getItem('token');

    return this.http.post<Response<number>>(
      `${environment.apiUrl}/api/v1/board/call`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  drawnANumber(drawnNumber: number) {
    const token = localStorage.getItem('token');

    return this.http.post<Response<object>>(
      `${environment.apiUrl}/api/v1/board/drawn/${drawnNumber}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  getAllSystemDrawnNumber() {
    const token = localStorage.getItem('token');

    return this.http.get<Response<number[]>>(
      `${environment.apiUrl}/api/v1/board/drawn`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  getAllMyDrawnNumber() {
    const token = localStorage.getItem('token');

    return this.http.get<Response<number[]>>(
      `${environment.apiUrl}/api/v1/board/drawn/my-number`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}
