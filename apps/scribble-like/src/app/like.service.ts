import { Injectable } from '@nestjs/common';
import { Like } from '../database/like.entity';
import {LikeDTO} from '@mar.io/models'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import {BadRequestException} from "@mar.io/exceptions"

@Injectable()
export class LikeService {
  constructor(@InjectRepository(Like)
  private likeRepository: Repository<Like>){

  }
  async like(likeDTO: LikeDTO): Promise<Like> {
    const deCrypted:any = await jwt.decode(likeDTO.token)
    if(!deCrypted)
    throw new BadRequestException('Incorrect request');

    const like = {
      userID: deCrypted.id,
      scribbleID: likeDTO.scribbleID
    }
    //FIXME enkele like voor een user per scribble.

    return this.likeRepository.save(like).then(res => {
      return res
    }).catch(err => {
      return err
    });
  }

  async LikesByScribbleID(scribbleId: number): Promise<any> {
    const [result, total] = await this.likeRepository.findAndCount({
      where: {scribbleID: scribbleId},
      
    }).then(res => {
      return res
    }).catch(err => {
      return err
    });

    return {data: result, count: total}
  }
}
