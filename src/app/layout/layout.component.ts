import { jwtDecode } from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Player } from '../types';
import { PlayerService } from '../services/player/player.service';
import config from '../config';
import { RoomService } from '../services/room/room.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    this.translate.setDefaultLang(
      localStorage.getItem('defaultLang') || config.langs.english
    );
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
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (!decodedToken?.exp) {
        this.router.navigate([config.routes.login]);
        return;
      }

      if (decodedToken.exp > currentTime) {
        this.router.navigate([config.routes.rooms]);
      } else {
        this.router.navigate([config.routes.login]);
        return;
      }
    } else {
      this.router.navigate([config.routes.login]);
      return;
    }

    // Get player info
    this.playerService.getMyInfo().subscribe({
      next: (response) => {
        // Player not found
        if (response.data === null) {
          this.router.navigate([config.routes.login]);
        }

        this.info = response.data;

        // Check if user is in bingo room
        const currentRoom = response.data.currentRoom;

        if (currentRoom === null) return;

        if (currentRoom.status === 'PLAYING') {
          this.isInBingoRoom = true;

          this.router.navigate([config.routes.bingo]);
        } else {
          this.router.navigate([config.routes.waiting]);
        }
      },
      error: (error) => {
        // Player not found
        if (error.error.data === null) {
          localStorage.removeItem('token');
          localStorage.removeItem('roomId');
          this.toastr.error(error.error.message);
          this.router.navigate([config.routes.login]);
        }
      },
    });

    // Check if user is in bingo room
    const bingoRooms = [config.routes.bingo, config.routes.drawn];
    this.isInBingoRoom = bingoRooms.includes(this.router.url);
  }

  leaveRoom() {
    this.roomService.leaveRoom().subscribe({
      next: () => {
        this.isInBingoRoom = false;
        this.router.navigate([config.routes.rooms]);
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      },
    });
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate([config.routes.login]);
  }
}
