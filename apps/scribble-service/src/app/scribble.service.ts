import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scribble } from '../database/scribble.entity';
import * as jwt from 'jsonwebtoken';
import {
  BadRequestException,
  InternalServerException,
} from '@mar.io/exceptions';
import { AuthViewmodel, ScribbleDTO, ScribbleViewmodel } from '@mar.io/models';
import { ClientProxy } from '@nestjs/microservices';
import { ProfileViewmodel } from 'libs/models/src/lib/profile/ProfileViewmodel';

@Injectable()
export class ScribbleService {
  constructor(
    @Inject('SCRIBBLE_SERVICE') private client: ClientProxy,
    @InjectRepository(Scribble)
    private scribbleRepository: Repository<Scribble>
  ) {}

  async getProfiles(res: any): Promise<any[]> {
    const scribbles: any[] = [];
    for (const scribble of res.data) {
      await this.client
        .send<string, number>('GET_PROFILE_BYID', scribble.userID)
        .toPromise()
        .then((profile) => {
          scribble.profile = (profile as unknown) as ProfileViewmodel;
          scribbles.push(scribble);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    res.data = scribbles;
    return res;
  }

  async getAuths(res: any): Promise<any[]> {
    const scribbles: any[] = [];
    for (const scribble of res.data) {
      await this.client
        .send<string, number>('GET_AUTH_BY_ID', scribble.userID)
        .toPromise()
        .then((auth) => {
          scribble.auth = (auth as unknown) as AuthViewmodel;
          scribbles.push(scribble);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    res.data = scribbles;
    return res;
  }

  async getLikesByID(res: any): Promise<any[]> {
    const scribbles: any[] = [];
    for (const scribble of res.data) {
      console.log(scribble.id);
      await this.client
        .send<string, number>('GET_LIKES_BY_ID', scribble.id)
        .toPromise()
        .then((likes: any) => {
          scribble.likes = likes.data;
          scribbles.push(scribble);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    res.data = scribbles;
    return res;
  }

  async getTrendsByID(res: any) {
    const scribbles: any[] = [];
    let trends: any[] = [];
    for (const scribble of res.data) {
      trends = [];
      for (const trend of scribble.trendIDs) {
        await this.client
          .send<string, number>('GET_TREND_BY_ID', +trend)
          .toPromise()
          .then((trend) => {
            trends.push(trend);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      scribble.trends = trends;
      scribbles.push(scribble);
    }
    res.data = scribbles;
    return res;
  }

  async getTrends(trendNames: string[]): Promise<any[]> {
    const trends: any[] = [];
    for (const trend of trendNames) {
      await this.client
        .send<string, string>('GET_TREND_BY_NAME', trend)
        .toPromise()
        .then((trend) => {
          trends.push(trend);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return trends;
  }

  async updateTrendUse(trends: any[]) {
    for (const trend of trends) {
      await this.client
        .send<string, Object>('UPDATE_USE_TREND', trend)
        .toPromise()
        .then((trend) => {
          return trend;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  async postScribble(scribbleDTO: ScribbleDTO): Promise<ScribbleViewmodel> {
    const deCrypted: any = await jwt.decode(scribbleDTO.token);
    if (!deCrypted) throw new BadRequestException('Incorrect request');

    const trends = await this.getTrends(scribbleDTO.hashtags);

    const scribble: any = {
      scribbleText: scribbleDTO.scribbleText,
      userID: deCrypted.id,
      trendIDs: [],
    };

    trends.forEach((trend) => {
      scribble.trendIDs.push(String(trend.id));
    });

    return this.scribbleRepository.save(scribble).then((res) => {
      this.updateTrendUse(trends);
      return res;
    });
  }

  async getAllScribblesByUserID(pageNumber: number) {
    const take = 10;
    const skip = pageNumber * 10;

    const [result, total] = await this.scribbleRepository.findAndCount({
      take: take,
      skip: skip,
      order: { createdDate: 'DESC' },
    });

    return { data: result, count: total };
  }

  async getAllScribblesByTrend(trend: string) {

    return this.getTrends([trend]).then((res) => {
      console.log(res[0])
      return this.scribbleRepository.find({where:{ trendIDs: res[0].id}})
     
    });
  }

  async getScribblesByUsername(username: string, pageNumber: number){
    const take = 10;
    const skip = pageNumber * 10;
   return await this.client
        .send<string, string>('GET_USER_BY_USERNAME', username)
        .toPromise()
        .then(async (user: any) => {
          const deCrypted:any = await jwt.decode(user.token);
          console.log(deCrypted)
          const [result, total] = await this.scribbleRepository.findAndCount({
            take: take,
            skip: skip,
            order: { createdDate: 'DESC' },
            where:{
              userID: deCrypted.id
            },
          });
      
          return { data: result, count: total }; 
        })
        .catch((err) => {
          console.log(err);
        });
  }
}
