import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../database/profile.entity';
import * as jwt from 'jsonwebtoken';
import {BadRequestException, InternalServerException} from '@mar.io/exceptions'
import { ProfileViewmodel } from 'libs/models/src/lib/profile/ProfileViewmodel';
import { ProfileDTO } from '@mar.io/models';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class ProfileService {
  constructor(
    @Inject('PROFILE_SERVICE') private client: ClientProxy,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>
  ) { }

  async getProfile(token: string): Promise<ProfileViewmodel> {
    const deCrypted:any = await jwt.decode(token);
    if(!deCrypted)
    throw new BadRequestException('Incorrect request');

   return this.profileRepository.findOne({where: {
     userID: deCrypted.id
   }}).then((res) =>{
      return res as ProfileViewmodel
    }).catch((err) =>{
      throw new InternalServerException(err) 
    })
  }

  async getProfileById(id: number): Promise<ProfileViewmodel> {
   return this.profileRepository.findOne({where: {
     userID: id
   }}).then((res) =>{
      return res as ProfileViewmodel
    }).catch((err) =>{
      console.log(err)
      throw new InternalServerException(err) 
    })
  }


  async postProfile(profileDTO: ProfileDTO): Promise<ProfileViewmodel> {
    const deCrypted:any = await jwt.decode(profileDTO.token)
    if(!deCrypted)
    throw new BadRequestException('Incorrect request');
    
    const profile: any = {
      bio: profileDTO.bio,
      age: profileDTO.age,
      photo: profileDTO.photo,
      userID: deCrypted.id
    }
    return this.profileRepository.save(profile)
  }

  async getProfileByUsername(username: string): Promise<ProfileViewmodel | void> {
    return await this.client
    .send<string, string>('GET_USER_BY_USERNAME', username)
    .toPromise()
    .then(async (user: any) => {
      const deCrypted:any = await jwt.decode(user.token);
      console.log(deCrypted)
      if(!deCrypted)
      throw new BadRequestException('Incorrect request');
      return this.getProfileById(deCrypted.id).then(res =>{
        deCrypted.profile = res
        return deCrypted
      })
    })
    .catch((err) => {
      console.log(err);
    });
  }
}
