import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [PlayerModule]
})
export class AppModule implements NestModule {

  //Aktywacja middleware/loggera
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
