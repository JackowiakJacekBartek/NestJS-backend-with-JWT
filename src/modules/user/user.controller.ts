import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from 'src/common/dto/updateUserDto';
import { AuthGuard } from '@nestjs/passport';

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

  @UseGuards(AuthGuard('jwt'))
  @Post(':id') 
  UpdateUserById(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto){
      // Sprawdź, czy identyfikator użytkownika w żądaniu jest zgodny z identyfikatorem użytkownika w tokenu JWT
      if (req.user.userId !== id) {
        throw new UnauthorizedException();
      }
    
      // Jeśli identyfikatory są zgodne, można wywołać metodę serwisu do aktualizacji użytkownika
      return this.userService.updateUserById(id, updateUserDto);
    }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
