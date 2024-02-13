import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room/room.service';
import { Room } from '../../types';
import config from '../../config';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { environment } from '../../../environment/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { faSolidSpinner } from '@ng-icons/font-awesome/solid';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [RouterLink, TranslateModule, NgIconComponent],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
  viewProviders: [provideIcons({ faSolidSpinner })],
})
export class RoomsComponent implements OnInit, OnDestroy {
  rooms: Room[] = [];
  waitingRoute = config.routes.waiting;
  createRoute = config.routes.create;
  stompClient!: CompatClient;
  joiningRoomId: string = '';

  constructor(
    private roomService: RoomService,
    private router: Router,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {
    this.translate.addLangs(Object.keys(config.langs));
    this.translate.setDefaultLang(localStorage.getItem('defaultLang') || 'en');

    this.connectWebSocket();
  }

  ngOnInit() {
    this.roomService.getAllRoom().subscribe((response) => {
      this.rooms = response.data;
    });
  }

  ngOnDestroy(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  connectWebSocket() {
    const ws = new SockJS(`${environment.apiUrl}/ws-bingo`);
    this.stompClient = Stomp.over(() => ws);

    this.stompClient.connect(
      {},
      () => {
        this.stompClient.subscribe('/topic/rooms', (message) => {
          const room: Room = JSON.parse(message.body);

          const index = this.rooms.findIndex((r) => r.roomId === room.roomId);

          // Create room
          if (index === -1) {
            this.rooms = [room, ...this.rooms];
            return;
          }

          // Room is playing
          if (room.status === 'PLAYING') {
            this.rooms.splice(index, 1);
            return;
          }

          // Update room (Player is join or leave)
          this.rooms[index] = room;
        });
      },
      () => {
        console.warn(
          'Error connecting to WebSocket server, retrying in 3 seconds...'
        );
        setTimeout(() => this.connectWebSocket(), 3000);
      }
    );
  }

  joinRoom(roomId: string) {
    this.roomService.joinRoom(roomId).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          localStorage.setItem('roomId', roomId);
          this.joiningRoomId = roomId;
          this.router.navigate([config.routes.waiting]);
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      },
    });
  }
}
