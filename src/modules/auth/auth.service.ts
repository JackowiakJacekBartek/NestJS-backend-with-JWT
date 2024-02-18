import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/common/dto/registerUserDto';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
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

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.userService.findByEmail(email);

    //Wyodrębnia ona właściwości z obiektu user. Konkretnie, wyodrębnia właściwość password i
    //zbiera resztę właściwości do nowego obiektu o nazwie result
    // const { password, ...result } = user;

    //generuje accesstoken
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
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
