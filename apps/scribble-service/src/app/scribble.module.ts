import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { Scribble } from '../database/scribble.entity';

import { ScribbleController } from './scribble.controller';
import { ScribbleService } from './scribble.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SCRIBBLE_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: 'redis://localhost:6379',
          auth_pass: new ConfigService().get<string>('REDIS_SECRET')
        }
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: new ConfigService().get<string>('TYPEORM_HOST'),
      port: +new ConfigService().get<string>('TYPEORM_PORT'),
      username: new ConfigService().get<string>('TYPEORM_USERNAME'),
      password: new ConfigService().get<string>('TYPEORM_PASSWORD'),
      database: new ConfigService().get<string>('TYPEORM_DATABASE'),
      entities: [Scribble],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Scribble]),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
        TYPEORM_HOST: Joi.string().required().default('127.0.0.1'),
        TYPEORM_USERNAME: Joi.string().required(),
        TYPEORM_PASSWORD: Joi.string().required(),
        TYPEORM_DATABASE: Joi.string().required().default('auth'),
        TYPEORM_PORT: Joi.number().required().default(false),
        TYPEORM_SYNCHRONIZE: Joi.bool().required().default(false),
        TYPEORM_LOGGING: Joi.bool().required().default(false),
        TYPEORM_MIGRATIONS_RUN: Joi.bool().required().default(false),
        TYPEORM_ENTITIES: Joi.string().required(),
        TYPEORM_MIGRATIONS: Joi.string().required(),
        TYPEORM_MIGRATIONS_DIR: Joi.string().required(),
      }),
    }),
  ],
  controllers: [ScribbleController],
  providers: [ScribbleService],
})
export class ScribbleModule {}
