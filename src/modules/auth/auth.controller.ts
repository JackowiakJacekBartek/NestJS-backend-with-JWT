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
import { LoginUserDto, RefreshTokenDto } from 'src/common/dto/loginUserDto';
import { RegisterUserDto } from 'src/common/dto/registerUserDto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Request } from 'express';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: RegisterUserDto })
  @Post('register')
  register(
    @Body(new ValidationPipe()) registerUserDto: RegisterUserDto,
    @Req() request: Request,
  ) {
    return this.authService.register(registerUserDto, request);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginUserDto })
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
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Body() response : RefreshTokenDto,
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

  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginUserDto })
  @Post('resendConfirmationEmail')
  async resendConfirmationEmail(
    @Res() res: Response,
    @Body(new ValidationPipe()) loginUserDto: LoginUserDto,
  ) {
    return res.status(HttpStatus.OK).json({
      message: 'Not implemented yet',
    });
  }
}
