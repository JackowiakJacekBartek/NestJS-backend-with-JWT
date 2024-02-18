import {
  ConflictException,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/common/dto/registerUserDto';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { User } from 'src/common/entity/users.entity';
import { randomUUID } from 'crypto';
import { RefreshToken } from 'src/common/entity/refreshtokens';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private tokenRepository: Repository<RefreshToken>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.userService.findByEmail(registerUserDto.email);
    if (user) {
      throw new UnauthorizedException();
      //throw new ConflictException('User already exists');
    }

    //hashowanie hasła
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(registerUserDto.password, salt);
    registerUserDto.password = password;

    return this.userService.saveUser(registerUserDto);
  }

  async signIn(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);

    if (!user || !bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException();
    }

    //Wyodrębnia ona właściwości z obiektu user. Konkretnie, wyodrębnia właściwość password i
    //zbiera resztę właściwości do nowego obiektu o nazwie result
    // const { password, ...result } = user;

    //generuje accesstoken
    const accessToken = await this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async generateAccessToken(id: number, email: string): Promise<string> {
    const payload = { id: id, email: email };
    return this.jwtService.signAsync(payload);
  }

  private async generateRefreshToken(idUser: number): Promise<string> {
    const payload = { refreshTokenPayload: randomUUID()};
    const refreshToken = await this.jwtService.signAsync(payload, { secret: jwtConstants.secretRefreshToken, expiresIn: '12h' });

    const existingRefreshToken = await this.tokenRepository.findOne({ where: { idUser: idUser } });

    if(existingRefreshToken) {
      this.tokenRepository.update({idUser: idUser}, {refreshToken: refreshToken});
    }
    else {
      this.tokenRepository.save({idUser: idUser, refreshToken: refreshToken})
    }
    return refreshToken;
  }

  async refreshToken(refreshToken: string){
      if (!refreshToken) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          refreshToken,
          {
            secret: jwtConstants.secretRefreshToken
          }
        );
      } catch {
        throw new UnauthorizedException();
      }

      const userByRefreshToken = await this.tokenRepository.findOne({ where: { refreshToken: refreshToken } });
      if(!userByRefreshToken){
        throw new UnauthorizedException();
      }
      const user = await this.userService.findUserById(userByRefreshToken.idUser)
      //sprawdzic czy refreshtoken znajduje sie w bazie jak nie to break
      //jak znajduje sie w bazie to wygenerowac nowy accesstoken i refreshtoken i nadpisac refreshtoken w bazie - zeby nie mozna bylo 2 raz go uzyc.

      this.tokenRepository.delete(userByRefreshToken);
      const newAccessToken =  await this.generateAccessToken(user.id, user.email);
      const newRefreshToken =  await this.generateRefreshToken(user.id);
      return { newAccessToken, newRefreshToken };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
