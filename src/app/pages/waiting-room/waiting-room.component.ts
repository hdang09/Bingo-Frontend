import { faSolidSpinner } from '@ng-icons/font-awesome/solid';
import { RoomService } from './../../services/room/room.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import config from '../../config';
import { Player, Room } from '../../types';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { environment } from '../../../environment/environment';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-waiting-room',
  standalone: true,
  imports: [RouterLink, NgIconComponent, TranslateModule],
  templateUrl: './waiting-room.component.html',
  styleUrl: './waiting-room.component.scss',
  viewProviders: [provideIcons({ faSolidSpinner })],
})
export class WaitingRoomComponent implements OnInit, OnDestroy {
  room: Room = {} as Room;
  isLoadingLeaveBtn = false;
  isLoadingStartBtn = false;
  stompClient!: CompatClient;

  constructor(
    private roomService: RoomService,
    private router: Router,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {
    this.translate.addLangs(Object.keys(config.langs));
    this.translate.setDefaultLang(
      localStorage.getItem('defaultLang') || config.langs.en
    );

    this.connectWebSocket();
  }

  ngOnInit() {
    this.roomService.getPlayers().subscribe({
      next: (response) => {
        this.room = response.data;
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  connectWebSocket() {
    const roomId = localStorage.getItem('roomId');

    const ws = new SockJS(`${environment.apiUrl}/ws-bingo`);
    this.stompClient = Stomp.over(() => ws);

    this.stompClient.connect(
      {},
      () => {
        // Subscribe to player that join room
        this.stompClient.subscribe(`/topic/players/${roomId}`, (message) => {
          const player: Player = JSON.parse(message.body);

          const index = this.room.players.findIndex(
            (p) => p.playerId === player.playerId
          );

          if (index !== -1) {
            this.room.players.splice(index, 1); // Player is leaving
          } else {
            this.room.players = [...this.room.players, player]; // Player is joining
          }
        });

        this.stompClient.subscribe(
          `/topic/room-started/${roomId}`,
          (message) => {
            const isStarted = JSON.parse(message.body);

            if (isStarted) {
              this.router.navigate([config.routes.bingo]);
            }
          }
        );
      },
      () => {
        console.warn(
          'Error connecting to WebSocket server, retrying in 3 seconds...'
        );
        setTimeout(() => this.connectWebSocket(), 3000);
      }
    );
  }

  leaveRoom() {
    this.isLoadingLeaveBtn = true;
    this.roomService.leaveRoom().subscribe({
      next: () => {
        this.isLoadingLeaveBtn = false;
        this.router.navigate([config.routes.rooms]);
      },
      error: (error) => {
        this.isLoadingLeaveBtn = false;
        this.toastr.error(error.error.message);
      },
    });
  }

  startRoom() {
    this.isLoadingStartBtn = true;
    this.roomService.startRoom().subscribe({
      next: () => {
        this.isLoadingStartBtn = false;
        this.router.navigate([config.routes.bingo]);
      },
      error: (error) => {
        this.isLoadingStartBtn = false;
        this.toastr.error(error.error.message);
      },
    });
  }
}
