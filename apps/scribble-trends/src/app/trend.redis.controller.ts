import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { TrendService } from './trend.service';



@Controller()
export class TrendRedisController {
  constructor(private readonly trendService: TrendService){}

    @MessagePattern('GET_TREND_BY_NAME')
    public getTrend(
      @Payload() name: string,
      @Ctx() context: RedisContext): Promise<any>{
          console.log(name)
    return this.trendService.getTrendByName(name);
  }

  @MessagePattern('UPDATE_USE_TREND')
  public updateTrendUse(
    @Payload() trend: Object,
    @Ctx() context: RedisContext): Promise<any>{
  return this.trendService.updateTrendUse(trend);
}

@MessagePattern('GET_TREND_BY_ID')
public getTrendById(
  @Payload() id: number,
  @Ctx() context: RedisContext): Promise<any>{
      console.log(id)
return this.trendService.getTrendById(id);
}

}
