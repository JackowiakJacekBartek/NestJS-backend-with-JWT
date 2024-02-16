import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    
    //hashowanie hasła
    const salt = bcrypt.genSaltSync(10)
    const password = bcrypt.hashSync(registerUserDto.password, salt)
    registerUserDto.password = password;

    return this.userService.saveUser(registerUserDto)
  }

  async signIn(username: string, pass: string): Promise<{access_token: string}> {
    const user = await this.userService.findByEmail(username);

    console.log(user.password)
    console.log(pass)

    //porownanie hasla plain text z zahashowanym
    if (!bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException();
    }

    //Wyodrębnia ona właściwości z obiektu user. Konkretnie, wyodrębnia właściwość password i
    //zbiera resztę właściwości do nowego obiektu o nazwie result
    // const { password, ...result } = user;

    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
