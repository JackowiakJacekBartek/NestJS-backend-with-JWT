import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuardApi } from './common/auth/auth.guardapi';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Aktywacja globalnego guarda
  //app.useGlobalGuards(new AuthGuardApi)

  await app.listen(3000);
}
bootstrap();
