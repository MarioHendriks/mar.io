import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { TrendService } from './trend.service';



@Controller()
export class TrendRedisController {
  constructor(private readonly trendService: TrendService){}

    @MessagePattern('GET_TREND_BY_NAME')
    public getProfile(
      @Payload() name: string,
      @Ctx() context: RedisContext): Promise<any>{
          console.log(name)
    return this.trendService.getTrendByName(name);
  }

}
