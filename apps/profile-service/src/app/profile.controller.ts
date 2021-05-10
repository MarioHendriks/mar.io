import { BadRequestException } from '@mar.io/exceptions';
import { ProfileDTO } from '@mar.io/models';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProfileViewmodel } from 'libs/models/src/lib/profile/ProfileViewmodel';

import { ProfileService } from './profile.service';

const typeOrmErr = {
  DUPE_ENTRY: 23505,
};

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get(':token')
  getProfile(@Param('token')token: string) {
   return this.profileService.getProfile(token);
  }

  @Post()
  async profile(@Body() profileDTO: ProfileDTO):Promise<ProfileViewmodel>{
    return this.profileService.postProfile(profileDTO).then(res =>{
      const profile: ProfileViewmodel = {...res}
      return profile
    }).catch((err: { message: string; code: string; detail: string }) => {
        let message = err.message;
        if (+err.code === typeOrmErr.DUPE_ENTRY) {
          let startIndex = err.detail.indexOf('(') + 1;
          let length = err.detail.indexOf(')') - startIndex;
          let errorKey = err.detail.substr(startIndex, length);

          message = `this ${errorKey} is already in use.`;
        }
        throw new BadRequestException(message);
      });
  }
}
