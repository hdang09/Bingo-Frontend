import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Player } from '../types';
import { PlayerService } from '../services/player/player.service';
import config from '../config';
import { RoomService } from '../services/room/room.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  info: Player = {} as Player;
  isInBingoRoom = false;

  constructor(
    private playerService: PlayerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private roomService: RoomService,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {
    this.translate.addLangs(Object.keys(config.langs));
    this.translate.setDefaultLang(localStorage.getItem('defaultLang') || 'en');
  }

  ngOnInit(): void {
    // Check token in URL when login with Google
    this.activatedRoute.queryParams.subscribe((params) => {
      const tokenInUrl = params['token'];

      if (tokenInUrl) {
        localStorage.setItem('token', tokenInUrl);
        this.router.navigate([config.routes.rooms]);
      }
    });

    // Check token in local storage
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate([config.routes.rooms]);
    } else {
      this.router.navigate([config.routes.login]);
    }

    // Get player info
    this.playerService.getMyInfo().subscribe((response) => {
      this.info = response.data;

      // Check if user is in bingo room
      const currentRoom = response.data.currentRoom;
      if (currentRoom != null) {
        if (currentRoom.status === 'PLAYING') {
          this.router.navigate([config.routes.bingo]);
        }
        this.router.navigate([config.routes.waiting]);
      }
    });

    // Check if user is in bingo room
    this.isInBingoRoom = this.router.url === config.routes.bingo;
  }

  leaveRoom() {
    this.roomService.leaveRoom().subscribe(
      () => {
        this.isInBingoRoom = false;
        this.router.navigate([config.routes.rooms]);
      },
      (error) => {
        this.toastr.error(error.error.message);
      }
    );
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate([config.routes.login]);
  }
}
