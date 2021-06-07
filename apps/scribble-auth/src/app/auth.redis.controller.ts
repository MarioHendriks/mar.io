import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import {AuthViewmodel} from '@mar.io/models'
import { ProfileViewmodel } from 'libs/models/src/lib/profile/ProfileViewmodel';
import { AuthService } from './auth.service';


@Controller()
export class AuthRedisController {
  constructor(private readonly authService: AuthService){}

    @MessagePattern('GET_AUTH_BY_ID')
    public getProfile(
      @Payload() id: Number,
      @Ctx() context: RedisContext): Promise<AuthViewmodel>{
    return this.authService.getAuthById(id);
  }

  @MessagePattern('GET_USER_BY_USERNAME')
  public getProfileByName(
    @Payload() name: string,
    @Ctx() context: RedisContext): Promise<AuthViewmodel>{
  return this.authService.getAuthByName(name);
}
}
