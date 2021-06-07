import { LikeDTO } from '@mar.io/models';
import { Body, Controller, Get, Post } from '@nestjs/common';

import { LikeService } from './like.service';

@Controller()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}
  
  @Post()
  like(@Body() like: LikeDTO) {
    return this.likeService.like(like);
  }
}
