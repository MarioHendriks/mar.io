import { InternalServerException } from '@mar.io/exceptions';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {ScribbleDTO, ScribbleViewmodel} from "@mar.io/models"
import { ScribbleService } from './scribble.service';

@Controller()
export class ScribbleController {
  constructor(private readonly scribbleService: ScribbleService) {}

  @Post()
  async postScribble(@Body() scribbleDTO: ScribbleDTO): Promise<ScribbleViewmodel> {
    return this.scribbleService.postScribble(scribbleDTO).then(res =>{
      return res
    }).catch(err => {
      throw new InternalServerException(err)
    });
  }
  
  @Get(':pageNumber')
  async getAllScribblesByUserID(@Param('pageNumber')pageNumber: number){
    return this.scribbleService.getAllScribblesByUserID(pageNumber)
  }
}
