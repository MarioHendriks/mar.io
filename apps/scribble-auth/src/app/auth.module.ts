import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Auth } from '../database/auth.entity';
import * as path from 'path';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: 'redis://localhost:6379',
          auth_pass: new ConfigService().get<string>('REDIS_SECRET')
        }
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'auth',
      entities: [Auth],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Auth]),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
        TYPEORM_CONNECTION: Joi.string().valid(
          'mysql',
          'mariadb',
          'postgres',
          'cockroachdb',
          'sqlite',
          'mssql',
          'sap',
          'oracle',
          'cordova',
          'nativescript',
          'react-native',
          'sqljs',
          'mongodb',
          'aurora-data-api',
          'aurora-data-api-pg',
          'expo',
          'better-sqlite3',
        ),
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
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
