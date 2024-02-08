import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import config from '../../config';
import { BoardService } from '../../services/board/board.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environment/environment';

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
    this.translate.addLangs(config.langs);
    this.translate.setDefaultLang(environment.defaultLang);

    this.boardService.getAllSystemDrawnNumber().subscribe((response) => {
      this.drawnNumbers = response.data;
    });
  }
}
