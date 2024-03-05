import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLoginDto {
  @IsString()
  @ApiProperty()
  login: string;
}

export class UpdateUserDataDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  fullName?: string;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  phoneNumber?: number;

  @IsString()
  @ApiProperty()
  @IsOptional()
  city?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  place?: string;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  salary?: number;

  @IsDateString()
  @ApiProperty()
  @IsOptional()
  birthDate?: Date;
}
