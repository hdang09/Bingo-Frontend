import { Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import config from '../../config';
import { BoardService } from '../../services/board/board.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CompatClient, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-drawn',
  standalone: true,
  imports: [RouterLink, TranslateModule, NgxSkeletonLoaderModule],
  templateUrl: './drawn.component.html',
  styleUrl: './drawn.component.scss',
})
export class DrawnComponent implements OnDestroy {
  drawnNumbers: number[] = [];
  bingoRoute = config.routes.bingo;
  loading: boolean = false;
  stompClient!: CompatClient;

  constructor(
    private boardService: BoardService,
    public translate: TranslateService
  ) {
    this.translate.addLangs(Object.keys(config.langs));
    this.translate.setDefaultLang(
      localStorage.getItem('defaultLang') || config.langs.en
    );

    this.loading = true;
    this.boardService.getAllSystemDrawnNumber().subscribe((response) => {
      this.drawnNumbers = response.data.sort((a, b) => a - b);
      this.loading = false;
    });

    this.connectWebSocket();
  }

  connectWebSocket() {
    const roomId = localStorage.getItem('roomId');

    const ws = new SockJS(`${environment.apiUrl}/ws-bingo`);
    this.stompClient = Stomp.over(() => ws);

    this.stompClient.connect(
      {},
      () => {
        this.stompClient.subscribe(`/topic/call/${roomId}`, (message) => {
          const drawnNumber = JSON.parse(message.body);
          this.drawnNumbers.push(drawnNumber);
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

  ngOnDestroy(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }
}
