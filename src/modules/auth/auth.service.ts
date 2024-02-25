import {
  ConflictException,
  HttpStatus,
  Injectable,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/common/dto/registerUserDto';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { RefreshToken } from 'src/common/entity/refreshtokens';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtConstants } from './constants';
import { MailService } from '../mail/mail.service';
import { Request } from 'express'
import { CreateUserDto } from 'src/common/dto/createUserDto';
import * as crypto from 'crypto';
import { Response } from 'express';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private tokenRepository: Repository<RefreshToken>,
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async register(registerUserDto: RegisterUserDto, request: Request) {
    const user = await this.userService.findByEmail(registerUserDto.email);
    if (user) {
      throw new UnauthorizedException();
      //throw new ConflictException('User already exists');
    }

    //hashowanie hasła
    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(registerUserDto.password, salt);
    registerUserDto.password = password;

    //to mi sie nie podoba
    const createUserDto = new CreateUserDto();
    createUserDto.name = registerUserDto.name;
    createUserDto.email = registerUserDto.email;
    createUserDto.password = registerUserDto.password;
    createUserDto.emailVerificationCode = this.generateVerificationCode(15);
    createUserDto.isConfirmedEmail = false;

    this.sendConfirmationEmail(request, createUserDto.emailVerificationCode, createUserDto.email);
    return this.userService.saveUser(createUserDto);
  }

  async signIn(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);

    if (!user || !bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException();
    }

    if(user.isConfirmedEmail === false) {
      throw new UnauthorizedException('Email has not been verified');
    }

    //Wyodrębnia ona właściwości z obiektu user. Konkretnie, wyodrębnia właściwość password i
    //zbiera resztę właściwości do nowego obiektu o nazwie result
    // const { password, ...result } = user;

    //generuje accesstoken
    const accesstoken = await this.generateAccessToken(user.id, user.email);
    const refrestoken = await this.generateRefreshToken(user.id);

    return { accesstoken, refrestoken };
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

      //sprawdzic czy refreshtoken znajduje sie w bazie jak nie to break
      if(!userByRefreshToken){
        throw new UnauthorizedException();
      }
      
      const user = await this.userService.findUserById(userByRefreshToken.idUser)
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

  async sendConfirmationEmail(request: Request, confirmationCode: string, targetEmail: string) {
    const host = request.get('host'); // Pobierz adres hosta z żądania
    const protocol = request.protocol; // Pobierz protokół (http lub https)
    const confirmationLink = `${protocol}://${host}/auth/confirm-email/${confirmationCode}?email=${targetEmail}`;
    await this.mailService.sendConfirmationEmail(targetEmail, confirmationLink)
  }

  generateVerificationCode(length: number): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
  }

  async confirmEmail(@Res() res: Response, email: string, code: string){
    const user = await this.userService.findByEmail(email);
    if (user && user.emailVerificationCode === code) {

      //update emailVerificationCode to true na bazie
      this.userService.confirmEmail(email)

      return res.status(HttpStatus.OK).json({
        message: 'Email has been confirmed',
      });
    }
    else{
      throw new UnauthorizedException();
    }
  }
}
