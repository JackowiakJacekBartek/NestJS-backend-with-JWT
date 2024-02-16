import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/modules/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Post()
  // createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
  //   return this.userService.saveUser(createUserDto);
  // }

  @UseGuards(AuthGuard)
  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
