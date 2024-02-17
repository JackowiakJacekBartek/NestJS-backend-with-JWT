import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { UpdateUserDto } from 'src/common/dto/updateUserDto';

@Controller('users')
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

  @Post(':id') 
  UpdateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto){
    return this.userService.updateUserById(id, updateUserDto);
  }
}
