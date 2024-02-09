export interface Room {
  roomId: string;
  roomName: string;
  joinedPlayers: number;
  maximumPlayers: number;
  betMoney: number;
  status: 'WAITING' | 'PLAYING' | 'FINISHED';
  players: Player[];
}

export interface Player {
  playerId: string;
  avatarUrl: string;
  fullName: string;
  host: boolean;
  email: string;
  balance: number;
  currentRoom: Room;
}

export interface Response<T> {
  status: 'SUCCESS' | 'FAILURE';
  message: string;
  data: T;
}

export interface Auth {
  accessToken: string;
  refreshToken: string;
}

export interface CreateAccount {
  fullName: string;
  avatar?: string;
}

export interface CreateRoom {
  roomName: string;
  betMoney: number;
  numberOfPlayers: number;
  width: number;
  height: number;
  maxNumberEachRow: number;
}
