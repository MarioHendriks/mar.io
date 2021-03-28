import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

import {Authenticated} from '../../../../libs/models/src/' //TODO fix this with @mar.io/models
import {RegisterRequest} from '../../../../libs/models/src/' //TODO fix this with @mar.io/models
import {AuthDTO} from '../../../../libs/models/src/' //TODO fix this with @mar.io/models
import {AuthViewmodel} from '../../../../libs/models/src/' //TODO fix this with @mar.io/models
import {LoginRequest} from '../../../../libs/models/src/' //TODO fix this with @mar.io/models
import {UnauthorizedException} from '../../../../libs/exceptions/src' //TODO fix this with @mar.io/exceptions
import { Auth } from '../database/auth.entity';



@Injectable()
export class AuthService {
  private jtwSecret: string;
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private configService: ConfigService,
  ) {
    this.jtwSecret = configService.get<string>('JWT_SECRET');
  }
  async register(req: RegisterRequest): Promise<Authenticated> {
    const saltOrRounds = 10;
    const password = req.password;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const authEntity: AuthDTO = {
      username: req.username,
      password: hash,
      email: req.email
    };

    return await this.authRepository.save(authEntity);
  }

  async forgeJWT(res: Authenticated): Promise<AuthViewmodel> {
    var token = jwt.sign(
      {
        username: res.username,
        role: res.role,
        accountStatus: res.accountStatus,
        email: res.email
      },
      this.jtwSecret,
      {
        expiresIn: 60 * 60,
      },
    );
    const authVM: AuthViewmodel = {
      token: token,
      username: res.username,
      role: res.role,
      accountStatus: res.accountStatus,
    };
    return authVM;
  }

  async login(req: LoginRequest): Promise<AuthViewmodel>{
    const user = await this.authRepository.findOne({
      where: {
        username: req.username
      }
    }) as Authenticated

    if(!user) throw new UnauthorizedException("Invalid credentials")

    if(!(await bcrypt.compare(req.password, user.password)))
      throw new UnauthorizedException("Invalid credentials")

    return await this.forgeJWT(user)
  }
}
