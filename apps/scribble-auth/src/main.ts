import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './app/auth.module';

  async function bootstrap() {
    const a = new ConfigService().get<string>('TYPEORM_ENTITIES')
    console.log(a) 
    const app = await NestFactory.create(AuthModule);
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
    await app.listen(3000);
    console.log(`auth-scribble service is running on: ${await app.getUrl()}`)

  }
  bootstrap();