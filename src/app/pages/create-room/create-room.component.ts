import { faSolidSpinner } from '@ng-icons/font-awesome/solid';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../services/room/room.service';
import { Router } from '@angular/router';
import config from '../../config';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [FormsModule, NgIconComponent, TranslateModule],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.scss',
  viewProviders: [provideIcons({ faSolidSpinner })],
})
export class CreateRoomComponent {
  roomName: string = '';
  betMoney: number = 0;
  numberOfPlayers: number = 0;
  width: number = 0;
  height: number = 0;
  maxNumberEachRow: number = 0;
  isLoading = false;

  constructor(
    private roomService: RoomService,
    private router: Router,
    private toastr: ToastrService,
    public translate: TranslateService
  ) {
    this.translate.addLangs(Object.keys(config.langs));
    this.translate.setDefaultLang(localStorage.getItem('defaultLang') || 'en');
  }

  createRoom() {
    this.isLoading = true;
    const room = {
      roomName: this.roomName,
      betMoney: this.betMoney,
      numberOfPlayers: this.numberOfPlayers,
      width: this.width,
      height: this.height,
      maxNumberEachRow: this.maxNumberEachRow,
    };

    this.roomService.createRoom(room).subscribe({
      next: (response) => {
        this.isLoading = false;

        localStorage.setItem('roomId', response.data.roomId);

        this.router.navigate([config.routes.waiting]);
      },
      error: (error) => {
        this.isLoading = false;

        Object.values(error.error.data).forEach((message: any) => {
          this.toastr.error(message);
        });
      },
    });
  }
}
