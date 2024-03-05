import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  UpdateLoginDto,
  UpdateUserDataDto,
} from 'src/common/dto/updateUserDto';
import { AuthGuardAccessToken } from 'src/common/auth/auth.guardaccesstoken';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Request as RequestExpress } from 'express';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuardAccessToken)
  @ApiBearerAuth()
  @Get('accesstoken-info')
  getProfile(@Request() req: RequestExpress) {
    return req.user;
  }

  @UseGuards(AuthGuardAccessToken)
  @ApiBearerAuth()
  @Post('update-userdata')
  @ApiBody({ type: UpdateUserDataDto })
  updateUserData(
    @Request() req,
    @Body(new ValidationPipe()) updateUserDataDto: UpdateUserDataDto,
  ) {
    return this.userService.updateUserData(req.user.id, updateUserDataDto);
  }

  @Get('userdata/:id')
  getUserdata(
    @Param('id', ParseIntPipe) id: number
  ){
    return this.userService.getUserDataById(id);
  }
}
