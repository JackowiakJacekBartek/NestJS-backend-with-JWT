import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { Unique } from 'typeorm';
import { MatchesProperty } from '../decorators/matches-property.decorator';

@Unique(['email'])
export class RegisterUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1
  })
  password: string;

  @MatchesProperty('password', { message: 'Passwords do not match' })
  confirmPassword: string;

}