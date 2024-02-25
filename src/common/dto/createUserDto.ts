import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';
import { Unique } from 'typeorm';

@Unique(['email'])
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  emailVerificationCode: string;

  @IsBoolean()
  isConfirmedEmail: boolean;
}