import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { ProfileService } from './profile.service';
import {AuthViewmodel} from '@mar.io/models'
import { ProfileViewmodel } from 'libs/models/src/lib/profile/ProfileViewmodel';


@Controller()
export class ProfileRedisController {
  constructor(private readonly profileService: ProfileService){}

    @MessagePattern('GET_PROFILE')
    public getProfile(
      @Payload() authVM: AuthViewmodel,
      @Ctx() context: RedisContext): Promise<ProfileViewmodel>{
    return this.profileService.getProfile(authVM.token);
  }

  @MessagePattern('GET_PROFILE_BYID')
  public getProfileByID(
    @Payload() id: number,
    @Ctx() context: RedisContext): Promise<ProfileViewmodel>{
  return this.profileService.getProfileById(id);
}
}
