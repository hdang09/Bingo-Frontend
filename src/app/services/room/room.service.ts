import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateRoom, Response, Room } from '../../types';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private http: HttpClient) {}

  getAllRoom() {
    const token = localStorage.getItem('token');

    return this.http.get<Response<Room[]>>(
      `${environment.apiUrl}/api/v1/room/all`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  joinRoom(roomId: string) {
    const token = localStorage.getItem('token');

    return this.http.post<Response<object>>(
      `${environment.apiUrl}/api/v1/room/join/${roomId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  leaveRoom() {
    const token = localStorage.getItem('token');

    return this.http.delete<Response<object>>(
      `${environment.apiUrl}/api/v1/room/leave`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  startRoom() {
    const token = localStorage.getItem('token');

    return this.http.get<Response<object>>(
      `${environment.apiUrl}/api/v1/room/start`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  getPlayers() {
    const token = localStorage.getItem('token');

    return this.http.get<Response<Room>>(
      `${environment.apiUrl}/api/v1/room/players`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }

  createRoom(room: CreateRoom) {
    const token = localStorage.getItem('token');

    return this.http.post<Response<Room>>(
      `${environment.apiUrl}/api/v1/room/create`,
      room,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  }
}
