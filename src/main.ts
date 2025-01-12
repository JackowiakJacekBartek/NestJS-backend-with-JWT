import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthGuardApi } from './common/auth/auth.guardapi';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Aktywacja globalnego guarda
  //app.useGlobalGuards(new AuthGuardApi)

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
