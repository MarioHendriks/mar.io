import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ScribbleModule } from './app/scribble.module';


  async function bootstrap() {
    const app = await NestFactory.create(ScribbleModule);
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.REDIS,
      options: {
        url: 'redis://localhost:6379',
        auth_pass: new ConfigService().get<string>('REDIS_SECRET')
      }
    });
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors()
    await app.startAllMicroservicesAsync();
    await app.listen(3003);
    console.log(`scribble service is running on: ${await app.getUrl()}`)

  }
  bootstrap();