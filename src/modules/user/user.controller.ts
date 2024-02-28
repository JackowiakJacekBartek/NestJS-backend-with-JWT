import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from 'src/common/dto/updateUserDto';
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
  @ApiBody({ type: UpdateUserDto })
  @Post('update-login') 
  updateLoginByEmail(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto){
      
      // Sprawdź, czy identyfikator użytkownika w żądaniu jest zgodny z identyfikatorem użytkownika w tokenu JWT
      // if (req.user.id !== id) {
      //   throw new UnauthorizedException();
      // }
    
      // Jeśli identyfikatory są zgodne, można wywołać metodę serwisu do aktualizacji użytkownika
      return this.userService.updateLoginByEmail(req.user.email, updateUserDto);
    }

  @UseGuards(AuthGuardAccessToken)
  @ApiBearerAuth()
  @Get('accesstoken-info')
  getProfile(@Request() req : RequestExpress) {
    return req.user;
  }

  @Get('test')
  updateUserData() {
    return this.userService.saveFullName(4);
  }
}
