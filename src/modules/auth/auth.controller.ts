import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
  Res,
  Param,
  ParseIntPipe,
  Req,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/common/dto/loginUserDto';
import { RegisterUserDto } from 'src/common/dto/registerUserDto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(
    @Body(new ValidationPipe()) registerUserDto: RegisterUserDto,
    @Req() request: Request,
  ) {
    return this.authService.register(registerUserDto, request);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body(new ValidationPipe()) loginUserDto: LoginUserDto,
  ) {
    const tokens = await this.authService.signIn(
      loginUserDto.email,
      loginUserDto.password,
    );

    res.cookie('refreshToken', tokens.refrestoken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    return { accesstoken: tokens.accesstoken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Body() response,
  ) {
    const tokens = await this.authService.refreshToken(response.refreshtoken);

    res.cookie('refreshToken', tokens.newRefreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    return { accesstoken: tokens.newAccessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Get('confirm-email/:code')
  async confirmEmail(
    @Query('email') email: string,
    @Param('code') code: string,
    @Res() res: Response,
  ) {
    return this.authService.confirmEmail(res, email, code);
  }
}
