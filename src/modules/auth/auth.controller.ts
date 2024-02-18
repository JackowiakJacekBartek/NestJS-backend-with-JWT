import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, ValidationPipe, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/common/dto/loginUserDto';
import { RegisterUserDto } from 'src/common/dto/registerUserDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body(new ValidationPipe()) registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body(new ValidationPipe()) loginUserDto: LoginUserDto) {
    return this.authService.signIn(loginUserDto.email, loginUserDto.password);
  }
}
