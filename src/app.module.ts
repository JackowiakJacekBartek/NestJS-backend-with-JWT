import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { PlayerModule } from './player/player.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './common/entity/user.entity';

@Module({
  imports: [
    PlayerModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'BARTEK',
      port: 1433,
      username: 'bartek',
      password: 'bartek',
      database: 'nestjs',
      entities: [User],
      synchronize: true,
      extra: {
        trustServerCertificate: true, //bez tego nie chciał się połączyć
      }
    }),
  ],
})
export class AppModule implements NestModule {
  //Aktywacja middleware/loggera
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
