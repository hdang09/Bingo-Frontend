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
  stompClient: CompatClient;

  constructor(
    private roomService: RoomService,
    private router: Router,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {
    this.translate.addLangs(Object.keys(config.langs));
    this.translate.setDefaultLang(localStorage.getItem('defaultLang') || 'en');

    const ws = new SockJS(`${environment.apiUrl}/ws-bingo`);
    this.stompClient = Stomp.over(() => ws);
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

    this.stompClient.connect({}, () => {
      const roomId = localStorage.getItem('roomId');

      // Subscribe to player that join room
      this.stompClient.subscribe(`/topic/players/join/${roomId}`, (message) => {
        this.room.players.push(JSON.parse(message.body));
      });

      // Subscribe to player that leave room
      this.stompClient.subscribe(
        `/topic/players/leave/${roomId}`,
        (message) => {
          const leavePlayer: Player = JSON.parse(message.body);
          this.room.players = this.room.players.filter(
            (player: Player) => player.playerId !== leavePlayer.playerId
          );
        }
      );

      this.stompClient.subscribe(`/topic/room-started/${roomId}`, (message) => {
        const isStarted = JSON.parse(message.body);

        if (isStarted) {
          this.router.navigate([config.routes.bingo]);
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
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
