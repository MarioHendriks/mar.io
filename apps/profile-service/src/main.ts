import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';


  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
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
    await app.listen(3002);
    console.log(`profile-scribble service is running on: ${await app.getUrl()}`)

  }
  bootstrap();