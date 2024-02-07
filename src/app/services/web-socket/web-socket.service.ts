import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  public stompClient: any;

  constructor() {
    const ws = new SockJS(`${environment.apiUrl}/ws-bingo`);
    this.stompClient = Stomp.over(() => ws);
  }

  connect(callback: () => void) {
    this.stompClient.connect({}, callback);
  }

  subscribe(topic: string, callback: (message: any) => void) {
    this.stompClient.subscribe(topic, callback);
  }

  connectAndSubscrbe(topic: string, callback: (message: any) => void) {
    this.connect(() => this.subscribe(topic, callback));
  }
}
