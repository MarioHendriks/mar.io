import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './app/mail/mail.module';
import * as path from 'path';


@Module({
  imports: [
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (configService: ConfigService) => {
        return {
          transport: configService.get<string>('SMTP_CONNECTION'),
          defaults: {
            from: '"Scribble.io validate account" <noreply@scribble.io>',
          },
          template: {
            dir: path.resolve(process.cwd(), 'apps/scribble-mail/src/templates'), //FIXME try to fix this with __Dirname
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})

export class AppModule {}
