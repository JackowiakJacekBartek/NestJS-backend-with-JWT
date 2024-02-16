import { IsEmail, IsString } from 'class-validator';
import { Unique } from 'typeorm';

@Unique(['email'])
export class LoginUserDto {
    
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}