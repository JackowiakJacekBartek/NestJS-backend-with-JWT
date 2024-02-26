import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Unique } from 'typeorm';

@Unique(['email'])
export class LoginUserDto {
    
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;
}

export class RefreshTokenDto {
    
  @IsString()
  @ApiProperty({ type: String, description: "refresh token"})
  refreshtoken: string;
}