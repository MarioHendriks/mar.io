import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

import { AccountStatus, Authenticated, VerifyRequest } from '@mar.io/models';
import { RegisterRequest } from '@mar.io/models';
import { AuthDTO } from '@mar.io/models';
import { AuthViewmodel } from '@mar.io/models';
import { LoginRequest } from '@mar.io/models';
import { UnauthorizedException } from '@mar.io/exceptions';
import { Auth } from '../database/auth.entity';

@Injectable()
export class AuthService {
  private jtwSecret: string;
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private configService: ConfigService
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
      email: req.email,
    };

    return await this.authRepository.save(authEntity);
  }

  async forgeJWT(res: Authenticated): Promise<AuthViewmodel> {
    var token = jwt.sign(
      {
        id: res.id,
        username: res.username,
        role: res.role,
        accountStatus: res.accountStatus,
        email: res.email,
      },
      this.jtwSecret,
      {
        expiresIn: 60 * 60,
      }
    );
    const authVM: AuthViewmodel = {
      token: token,
      username: res.username,
      role: res.role,
      accountStatus: res.accountStatus,
      profile: undefined,
    };
    return authVM;
  }

  async login(req: LoginRequest): Promise<AuthViewmodel> {
    const user = (await this.authRepository.findOne({
      where: {
        username: req.username,
      },
    })) as Authenticated;

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!(await bcrypt.compare(req.password, user.password)))
      throw new UnauthorizedException('Invalid credentials');

    return await this.forgeJWT(user);
  }

  async verify(req: VerifyRequest): Promise<AuthViewmodel> {
    const deCrypted: any = await jwt.decode(req.token);
    const user = await this.authRepository
      .findOne({
        where: {
          username: deCrypted.username,
        },
      })
      .then(async (res: any) => {
        res.accountStatus = AccountStatus.activated;
        await this.authRepository.update(res.id, res);
        return res;
      });

    return await this.forgeJWT(user);
  }

  async getAuthById(id: Number) {
    const user = await this.authRepository
      .findOne({
        where: {
          id: id,
        },
      })
      .then(async (res: any) => {
        return res;
      });
    return await this.forgeJWT(user);
  }

  async getAuthByName(name: string) {
    const user = await this.authRepository
      .findOne({
        where: {
          username: name,
        },
      })
      .then(async (res: any) => {
        return res;
      });
    return await this.forgeJWT(user);
  }
}
