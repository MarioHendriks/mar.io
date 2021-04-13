import { GetProfile } from '@mar.io/models';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../database/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>
  ) { }

  getProfile(profile: GetProfile): String {
    this.profileRepository.findOne(profile.id).then((res) =>{

    }).catch((err) =>{
      
    })
    return 'Welcome to profile-service!';
  }
}
