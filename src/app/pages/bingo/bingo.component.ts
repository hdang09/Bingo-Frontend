import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import config from '../../config';
import { BoardService } from '../../services/board/board.service';
import SockJS from 'sockjs-client';
import { environment } from '../../../environment/environment';
import { CompatClient, Stomp } from '@stomp/stompjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { faSolidCirclePlay } from '@ng-icons/font-awesome/solid';
import { PlayerService } from '../../services/player/player.service';

@Component({
  selector: 'app-bingo',
  standalone: true,
  imports: [RouterLink, TranslateModule, NgIconComponent],
  templateUrl: './bingo.component.html',
  styleUrl: './bingo.component.scss',
  viewProviders: [provideIcons({ faSolidCirclePlay })],
})
export class BingoComponent implements OnInit, OnDestroy {
  drawnRoute = config.routes.drawn;
  board: number[][] = [];
  drawnNumber = 0;
  myDrawnNumber: number[] = [];
  stompClient!: CompatClient;
  playerId: string = '';

  constructor(
    private boardService: BoardService,
    private playerService: PlayerService,
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

  ngOnInit(): void {
    this.boardService.getBoard().subscribe({
      next: (response) => {
        this.board = response.data;
      },
      error: (error) => {
        this.toastr.error(error.error.message);

        this.router.navigate([config.routes.rooms]);
      },
    });

    this.boardService.getAllMyDrawnNumber().subscribe((response) => {
      this.myDrawnNumber = response.data;
    });

    this.playerService.getMyInfo().subscribe((response) => {
      this.playerId = response.data.playerId;
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
        this.stompClient.subscribe(`/topic/call/${roomId}`, (message) => {
          this.drawnNumber = JSON.parse(message.body);
        });

        this.stompClient.subscribe(
          `/topic/drawn/${this.playerId}`,
          (message) => {
            const drawnNumber = JSON.parse(message.body);

            if (!this.myDrawnNumber.includes(drawnNumber)) {
              this.myDrawnNumber.push(drawnNumber);
            }
          }
        );

        this.stompClient.subscribe(`/topic/win/${roomId}`, (message) => {
          this.toastr.info(message.body);

          setTimeout(() => {
            this.router.navigate([config.routes.rooms]);
          }, 5000);
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

  callNumber() {
    this.boardService.callNumber().subscribe({
      next: (response) => {
        this.drawnNumber = response.data;
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      },
    });
  }

  drawn(drawnNumber: number) {
    // this.myRecentDrawn = drawnNumber;
    this.boardService.drawnANumber(drawnNumber).subscribe({
      next: (response) => {
        if (!this.myDrawnNumber.includes(drawnNumber)) {
          this.myDrawnNumber.push(drawnNumber);
        }

        if (response.message.includes('BINGO')) {
          this.toastr.success(response.message);

          setTimeout(() => {
            this.router.navigate([config.routes.rooms]);
          }, 5000);
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      },
    });
  }
}
