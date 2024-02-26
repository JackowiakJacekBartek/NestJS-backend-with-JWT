import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { Unique } from 'typeorm';
import { MatchesProperty } from '../decorators/matches-property.decorator';
import { ApiProperty } from '@nestjs/swagger';

@Unique(['email'])
export class RegisterUserDto {

  @ApiProperty({ type: String, description: "name"})
  @IsString()
  name: string;

  @ApiProperty({ type: String, description: "email"})
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: "password"})
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1
  })
  password: string;

  @ApiProperty({ type: String, description: "confirmPassword"})
  @MatchesProperty('password', { message: 'Passwords do not match' })
  confirmPassword: string;

}