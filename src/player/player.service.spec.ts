import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';


describe('AppService', () => {
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerService],
    }).compile();

    playerService = module.get<PlayerService>(PlayerService);
  });

  describe('getRandomPlayer', () => {
    it('should return a random player from the list', () => {
      const player = playerService.getRandomPlayer();
      expect(player).toBeDefined();
      expect(player.name).toBeDefined();
      expect(player.surname).toBeDefined();
      expect(player.age).toBeDefined();
    });
  });

  //"npm test" AAA (Arrange, Act, Assert) d
  describe('getPlayers', () => {
    it('should return a random player', () => {
      const players = playerService.getAllPlayers();

      let randomPlayer = playerService.getRandomPlayer();

      const isValidPlayer = players.some(
        (player) => player.name === randomPlayer.name,
      );

      expect(isValidPlayer).toBe(true);
    });
  });
});
