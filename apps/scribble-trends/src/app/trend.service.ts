import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trend } from '../database/trend.entity';
import {TrendDTO} from '@mar.io/models'

@Injectable()
export class TrendService {
  constructor(  @InjectRepository(Trend)
  private trendRepository: Repository<Trend>){}

  async getTrendByName(name: string): Promise<Trend> {
    return await this.trendRepository
      .findOne({
        where: {
          trend: name,
        },
      })
      .then(res => {
        let trend: any = res
        if(!trend){
         trend = this.createTrend(name).then(res =>{
            return res
          })
        }
      return trend
      });
  }

  async createTrend(name: string): Promise<any>{
    const trend : TrendDTO = {
      trend: name
    }
     return await this.trendRepository.save(trend).then(res =>{
      return res
    })
  }
}
