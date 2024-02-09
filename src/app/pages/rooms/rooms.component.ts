import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room/room.service';
import { Room } from '../../types';
import config from '../../config';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { environment } from '../../../environment/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  waitingRoute = config.routes.waiting;
  createRoute = config.routes.create;
  stompClient: any;
  joiningRoomId: string = '';

  constructor(
    private roomService: RoomService,
    private router: Router,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {
    this.translate.addLangs(Object.keys(config.langs));
    this.translate.setDefaultLang(localStorage.getItem('defaultLang') || 'en');
  }

  ngOnInit() {
    this.roomService.getAllRoom().subscribe((response) => {
      this.rooms = response.data;
    });

    const ws = new SockJS(`${environment.apiUrl}/ws-bingo`);
    this.stompClient = Stomp.over(() => ws);

    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/rooms', (message: any) => {
        this.rooms = JSON.parse(message.body);
      });
    });
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
