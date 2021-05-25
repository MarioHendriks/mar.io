import { InternalServerException } from '@mar.io/exceptions';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ScribbleDTO, ScribbleViewmodel } from '@mar.io/models';
import { ScribbleService } from './scribble.service';
import { ClientProxy } from '@nestjs/microservices';
import { ProfileViewmodel } from 'libs/models/src/lib/profile/ProfileViewmodel';

@Controller()
export class ScribbleController {
  constructor(
    private readonly scribbleService: ScribbleService,
    @Inject('SCRIBBLE_SERVICE') private client: ClientProxy
  ) {}

  @Post()
  async postScribble(
    @Body() scribbleDTO: ScribbleDTO
  ): Promise<ScribbleViewmodel> {
    return this.scribbleService
      .postScribble(scribbleDTO)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw new InternalServerException(err);
      });
  }

  @Get(':pageNumber')
  async getAllScribblesByUserID(@Param('pageNumber') pageNumber: number) {
    return this.scribbleService
      .getAllScribblesByUserID(pageNumber)
      .then((res) => {
        return this.scribbleService.getAuths(res).then(auths => {
          return this.scribbleService.getProfiles(auths).then(profiles => {
            return profiles
          })
        })
      });
  }
}
