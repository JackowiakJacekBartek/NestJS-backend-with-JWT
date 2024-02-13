import { Injectable } from '@nestjs/common';
import { Player } from './interfaces/player.interface';

@Injectable()
export class AppService {
  players: Player[] = [
    { name: 'Lionel', surname: 'Messi', age: 34 },
    { name: 'Cristiano', surname: 'Ronaldo', age: 37 },
    { name: 'Neymar', surname: 'Jr', age: 30 },
    { name: 'Kylian', surname: 'Mbappé', age: 23 },
    { name: 'Kevin', surname: 'De Bruyne', age: 30 },
    { name: 'Robert', surname: 'Lewandowski', age: 33 },
    { name: 'Mohamed', surname: 'Salah', age: 30 },
    { name: 'Harry', surname: 'Kane', age: 29 },
    { name: 'Erling', surname: 'Haaland', age: 21 },
    { name: 'Romelu', surname: 'Lukaku', age: 29 },
    { name: 'Sadio', surname: 'Mané', age: 30 },
    { name: 'Karim', surname: 'Benzema', age: 35 },
    { name: 'Raheem', surname: 'Sterling', age: 28 },
    { name: 'Joshua', surname: 'Kimmich', age: 27 },
    { name: 'Luka', surname: 'Modric', age: 37 },
    { name: 'Gareth', surname: 'Bale', age: 32 },
    { name: 'Marco', surname: 'Reus', age: 33 },
    { name: 'Toni', surname: 'Kroos', age: 32 },
    { name: 'Antoine', surname: 'Griezmann', age: 31 },
    { name: 'Paul', surname: 'Pogba', age: 30 },
  ];

  getRandomPlayer(): Player {
    const randomIndex = Math.floor(Math.random() * this.players.length);
    return this.players[randomIndex];
  }

  getPlayerById(id: number): Player {
    return this.players[id];
  }

  addPlayer(player: Player): Player {
    this.players.push(player);
    return player;
  }

  getAllPlayers(): Player[] {
    return this.players;
  }

  putPlayer(id: number, player: Player): Player {
    this.players[id] = player;
    return this.players[id];
  }

  patchPlayer(id: number, player: Partial<Player>): Player {
    this.players[id] = {
      ...this.players[id], // Skopiowanie istniejących pól zasobu
      ...player, // Aktualizacja pól na podstawie danych z obiektu `updateResourceDto`
    };
    return this.players[id];
  }

  deletePlayer(id: number): Player[] {
    this.players.splice(id, 1);
    return this.players;
  }
}
