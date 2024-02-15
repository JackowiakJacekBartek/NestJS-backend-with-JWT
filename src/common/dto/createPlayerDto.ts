import { IsInt, IsString } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsInt()
  age: number;
}