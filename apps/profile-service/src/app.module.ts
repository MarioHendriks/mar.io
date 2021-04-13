import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';

import { ProfileController } from './app/profile.controller';
import { ProfileService } from './app/profile.service';
import { Profile } from './database/profile.entity';

@Module({
  imports: [ ClientsModule.register([
    {
      name: 'PROFILE_SERVICE',
      transport: Transport.REDIS,
      options: {
        url: 'redis://localhost:6379',
        auth_pass: new ConfigService().get<string>('REDIS_SECRET')
      }
    },
  ]),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: new ConfigService().get<string>('TYPEORM_HOST_2'),
    port: +new ConfigService().get<string>('TYPEORM_PORT_2'),
    username: new ConfigService().get<string>('TYPEORM_USERNAME_2'),
    password: new ConfigService().get<string>('TYPEORM_PASSWORD_2'),
    database: new ConfigService().get<string>('TYPEORM_DATABASE_2'),
    entities: [Profile],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([Profile]),
  ConfigModule.forRoot({
    validationSchema: Joi.object({
      NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
      TYPEORM_HOST_1: Joi.string().required().default('127.0.0.1'),
      TYPEORM_USERNAME_1: Joi.string().required(),
      TYPEORM_PASSWORD_1: Joi.string().required(),
      TYPEORM_DATABASE_1: Joi.string().required().default('profile'),
      TYPEORM_PORT_1: Joi.number().required().default(false),
      TYPEORM_SYNCHRONIZE: Joi.bool().required().default(false),
      TYPEORM_LOGGING: Joi.bool().required().default(false),
      TYPEORM_MIGRATIONS_RUN: Joi.bool().required().default(false),
      TYPEORM_ENTITIES: Joi.string().required(),
      TYPEORM_MIGRATIONS: Joi.string().required(),
      TYPEORM_MIGRATIONS_DIR: Joi.string().required(),
    }),
  }),
],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class AppModule {}
