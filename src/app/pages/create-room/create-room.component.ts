import { faSolidSpinner } from '@ng-icons/font-awesome/solid';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../services/room/room.service';
import { Router } from '@angular/router';
import config from '../../config';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [FormsModule, NgIconComponent],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.scss',
  viewProviders: [provideIcons({ faSolidSpinner })],
})
export class CreateRoomComponent {
  roomName: string = '';
  betMoney: number = 0;
  slot: number = 0;
  width: number = 0;
  height: number = 0;
  maxNumberEachRow: number = 0;
  isLoading = false;

  constructor(
    private roomService: RoomService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  createRoom() {
    this.isLoading = true;
    const room = {
      roomName: this.roomName,
      betMoney: this.betMoney,
      slot: this.slot,
      width: this.width,
      height: this.height,
      maxNumberEachRow: this.maxNumberEachRow,
    };

    this.roomService.createRoom(room).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate([config.routes.waiting]);
      },
      error: (error) => {
        this.isLoading = false;
        this.toastr.error(error.error.message);
      },
    });
  }
}
