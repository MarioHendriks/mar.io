import { AuthViewmodel, LikeDTO } from '@mar.io/models';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RedisContext } from '@nestjs/microservices';

import { LikeService } from './like.service';

@Controller()
export class likeRedisController {
  constructor(private readonly likeService: LikeService) {}

  @MessagePattern('GET_LIKES_BY_ID')
  public getLikeById(
    @Payload() id: number,
    @Ctx() context: RedisContext): Promise<AuthViewmodel>{
        console.log(id)
  return this.likeService.LikesByScribbleID(id);
    }
}
