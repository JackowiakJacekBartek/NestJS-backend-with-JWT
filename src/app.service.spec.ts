import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  describe('getRandomPlayer', () => {
    it('should return a random player from the list', () => {
      const player = appService.getRandomPlayer();
      expect(player).toBeDefined();
      expect(player.name).toBeDefined();
      expect(player.surname).toBeDefined();
      expect(player.age).toBeDefined();
    });
  });

  //"npm test" AAA (Arrange, Act, Assert) d
  describe('getPlayers', () => {
    it('should return a random player', () => {
      const players = appService.getAllPlayers();

      let randomPlayer = appService.getRandomPlayer();

      const isValidPlayer = players.some(
        (player) => player.name === randomPlayer.name,
      );

      expect(isValidPlayer).toBe(true);
    });
  });
});
