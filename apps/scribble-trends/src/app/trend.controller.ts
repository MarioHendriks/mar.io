import { Controller, Get } from '@nestjs/common';

import { TrendService } from './trend.service';

@Controller()
export class TrendController {
  constructor(private readonly trendService: TrendService) {}

  @Get('/trending')
  getTrending(){
    return this.trendService.getTrending()
  }
}
