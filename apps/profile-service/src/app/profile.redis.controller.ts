import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import {GetProfile} from '@mar.io/models'
import { ProfileService } from './profile.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../database/profile.entity';
import { Repository } from 'typeorm';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
    @Inject('PROFILE_SERVICE') private client: ClientProxy){}

    @MessagePattern('GET_PROFILE')
    public register(
      @Payload() profile: GetProfile,
      @Ctx() context: RedisContext,){
          
    return this.profileService.getProfile(profile);
  }
}
