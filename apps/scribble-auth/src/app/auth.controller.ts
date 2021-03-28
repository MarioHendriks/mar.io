import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {RegisterRequest} from '../../../../libs/models/src/' //TODO fix this with @mar.io/models
import {AuthViewmodel} from '../../../../libs/models/src/' //TODO fix this with @mar.io/models
import {LoginRequest} from '../../../../libs/models/src/' //TODO fix this with @mar.io/models

import {BadRequestException} from '../../../../libs/exceptions/src' //TODO fix this with @mar.io/exceptions
import { AuthService } from './auth.service';

const typeOrmErr = {
  DUPE_ENTRY: 23505,
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('AUTH_SERVICE') private client: ClientProxy,
  ) {}

  @Post('/register')
  public async register(@Body() req: RegisterRequest): Promise<AuthViewmodel> {
    if (req.password !== req.passwordVerify)
      throw new BadRequestException('password does not match');

    return this.authService
      .register(req)
      .then((res) => {
        const authViewModel = this.authService.forgeJWT(res);
        const mailobject = {
          email: res.email,
          username: res.username
        }
        this.client.send<string,object>("REGISTER_MAIL", mailobject).toPromise();
        return authViewModel;
      })
      .catch((err: { message: string; code: string; detail: string }) => {
        let message = err.message;
        if (+err.code === typeOrmErr.DUPE_ENTRY) {
          let startIndex = err.detail.indexOf('(') + 1;
          let length = err.detail.indexOf(')') - startIndex;
          let errorKey = err.detail.substr(startIndex, length);

          message = `this ${errorKey} is already in use.`;
        }

        throw new BadRequestException(message);
      });
  }

  @Post('/login')
  public async login(@Body() req: LoginRequest): Promise<AuthViewmodel> {
    return await this.authService
      .login(req)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
  }
}
