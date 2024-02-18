import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { PlayerModule } from './modules/player/player.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { User } from './common/entity/users.entity';
import { AuthModule } from './modules/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RemovePasswordInterceptor } from './common/interceptors/removePasswordInterceptor';
import { RefreshToken } from './common/entity/refreshtokens';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RemovePasswordInterceptor,
    },
  ],
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
      entities: [User, RefreshToken],
      synchronize: true,
      extra: {
        trustServerCertificate: true, //bez tego nie chciał się połączyć
      }
    }),
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  //Aktywacja middleware/loggera
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
