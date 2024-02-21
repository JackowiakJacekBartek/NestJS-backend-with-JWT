import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Załaduj plik konfiguracyjny .env, mozna to zrobic tylko w app.module
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Importujemy ConfigModule, jeśli korzystamy z konfiguracji z pliku .env
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <noreply@example.com>',
        },
      }),
      inject: [ConfigService], // Wstrzykujemy ConfigService do fabryki
    }),
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}