import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { WaitingRoomComponent } from './pages/waiting-room/waiting-room.component';
import { CreateRoomComponent } from './pages/create-room/create-room.component';
import { BingoComponent } from './pages/bingo/bingo.component';
import { DrawnComponent } from './pages/drawn/drawn.component';
import { LayoutComponent } from './layout/layout.component';
import config from './config';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: config.routes.login.substring(1),
    title: 'Login | Bingo Game',
    component: LoginComponent,
  },
  {
    path: config.routes.home.substring(1),
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: config.routes.rooms.substring(1),
        title: 'Rooms | Bingo Game',
        component: RoomsComponent,
      },
      {
        path: config.routes.waiting.substring(1),
        title: 'Waiting Room | Bingo Game',
        component: WaitingRoomComponent,
      },
      {
        path: config.routes.create.substring(1),
        title: 'Create Room | Bingo Game',
        component: CreateRoomComponent,
      },
      {
        path: config.routes.bingo.substring(1),
        title: 'Bingo Game',
        component: BingoComponent,
      },
      {
        path: config.routes.drawn.substring(1),
        title: 'Drawn Numbers | Bingo Game',
        component: DrawnComponent,
      },
    ],
  },
];
