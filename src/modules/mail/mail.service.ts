import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {

    constructor(private readonly mailerService: MailerService){}

    async sendConfirmationEmail(email: string, confirmationLink: string): Promise<void> {
        try {
          await this.mailerService.sendMail({
            to: email,
            subject: 'Potwierdzenie adresu e-mail',
            html: `<p>Kliknij poniższy link, aby potwierdzić swój adres e-mail:</p><p><a href="${confirmationLink}">${confirmationLink}</a></p>`,
          });
        } catch (error) {
          console.error('Błąd podczas wysyłania wiadomości e-mail:', error);
          // Tutaj możesz obsłużyć błąd w dowolny sposób, np. zarejestrować w dzienniku lub wysłać powiadomienie
        }
    }
}
