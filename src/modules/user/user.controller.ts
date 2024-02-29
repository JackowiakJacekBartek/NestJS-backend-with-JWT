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

  // @Post()
  // createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
  //   return this.userService.saveUser(createUserDto);
  // }

  // @UseGuards(AuthGuard)
  // @Get('all')
  // getAllUsers() {
  //   return this.userService.getAllUsers();
  // }

  @UseGuards(AuthGuardAccessToken)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateLoginDto })
  @Post('update-login')
  updateLoginByEmail(@Request() req, @Body() updateLoginDto: UpdateLoginDto) {
    // Sprawdź, czy identyfikator użytkownika w żądaniu jest zgodny z identyfikatorem użytkownika w tokenu JWT
    // if (req.user.id !== id) {
    //   throw new UnauthorizedException();
    // }

    // Jeśli identyfikatory są zgodne, można wywołać metodę serwisu do aktualizacji użytkownika
    return this.userService.updateLoginByEmail(req.user.email, updateLoginDto);
  }

  @UseGuards(AuthGuardAccessToken)
  @ApiBearerAuth()
  @Get('accesstoken-info')
  getProfile(@Request() req: RequestExpress) {
    return req.user;
  }

  @Post('update-userdata/:id')
  @ApiBody({ type: UpdateUserDataDto })
  updateUserData(
    @Body(new ValidationPipe()) updateUserDataDto: UpdateUserDataDto,
    @Param('id') id: number,
  ) {
    return this.userService.updateUserData(id, updateUserDataDto);
  }
}
