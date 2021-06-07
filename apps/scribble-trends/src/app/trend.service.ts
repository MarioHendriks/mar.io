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

  async getTrendById(id: number): Promise<Trend> {
    return await this.trendRepository
    .findOne({
      where: {
        id: id,
      },
    })
    .then(res => {
    return res
    }).catch(err => {
      console.log(err)
      throw err
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

  async updateTrendUse(trend: any): Promise<any> {
    trend.uses++
    this.trendRepository.save(trend).then(res => {
      return res
    }).catch(err => (
      console.log(err)
    ))
  }

  async getTrending(): Promise<Trend>{
    return this.trendRepository.findAndCount({
      order: {uses: 'DESC'},
      take: 10
    }).then(res =>{
      return res[0]
    }).catch(err =>{
      return err
    })
  }
}
