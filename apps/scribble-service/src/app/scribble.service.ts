import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scribble } from '../database/scribble.entity';
import * as jwt from 'jsonwebtoken';
import {BadRequestException, InternalServerException} from '@mar.io/exceptions'
import {ScribbleDTO, ScribbleViewmodel} from "@mar.io/models"

@Injectable()
export class ScribbleService {

  constructor(
  @InjectRepository(Scribble)
  private scribbleRepository: Repository<Scribble>){}
  async postScribble(scribbleDTO: ScribbleDTO): Promise<ScribbleViewmodel> {
    const deCrypted:any = await jwt.decode(scribbleDTO.token)
    if(!deCrypted)
    throw new BadRequestException('Incorrect request');
    
    const scribble: any = {
      scribbleText: scribbleDTO.scribbleText,
      userID: deCrypted.id
    }
    return this.scribbleRepository.save(scribble)
  }  
  async getAllScribblesByUserID(pageNumber: number) {
      const take = 10;
      const skip = pageNumber * 10;
  
      return this.scribbleRepository.findAndCount(
        {
            take: take,
            skip: skip
        }
    ).then(res =>{
      console.log(res)
      return res
    }).catch(err =>{
      throw err
    });

    };
  }
