import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import config from '../../config';
import { BoardService } from '../../services/board/board.service';

@Component({
  selector: 'app-drawn',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './drawn.component.html',
  styleUrl: './drawn.component.scss',
})
export class DrawnComponent {
  drawnNumbers: number[] = [];
  bingoRoute = config.routes.bingo;

  constructor(private boardService: BoardService) {
    this.boardService.getAllSystemDrawnNumber().subscribe((response) => {
      this.drawnNumbers = response.data;
    });
  }
}
