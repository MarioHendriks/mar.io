import { Body, Controller, Post } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern('REGISTER_MAIL')
  public register(
    @Payload() data: { email: string; username: string, token: string },
    @Ctx() context: RedisContext,
  ): void {
    console.log(data);
    this.mailService.send(
      data.email,
      `Welcome ${data.username}`,
      'user-registered.hbs',
      data,
    );

    // this.mailService.send(message.email, `Welcome ${message.firstname} ${message.lastname}`, 'user-registered.hbs', message)
  }
}
//maak resend functie