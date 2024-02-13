import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import config from '../../config';
import { BoardService } from '../../services/board/board.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-drawn',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './drawn.component.html',
  styleUrl: './drawn.component.scss',
})
export class DrawnComponent {
  drawnNumbers: number[] = [];
  bingoRoute = config.routes.bingo;

  constructor(
    private boardService: BoardService,
    public translate: TranslateService
  ) {
    this.translate.addLangs(Object.keys(config.langs));
    this.translate.setDefaultLang(localStorage.getItem('defaultLang') || 'en');

    this.boardService.getAllSystemDrawnNumber().subscribe((response) => {
      this.drawnNumbers = response.data.sort((a, b) => a - b);
    });
  }
}
