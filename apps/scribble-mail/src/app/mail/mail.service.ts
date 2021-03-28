import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  send(to, subject, template, context): void {
    this.mailerService
      .sendMail({
        to: to,
        from: 'noreply@scribble.io',
        subject: subject,
        template: template,
        context: context,
      })
      .then(() => {
        console.log('mail sent');
      })
      .catch((error) => {
        console.log('mail not sent', error);
      });
  }
}
