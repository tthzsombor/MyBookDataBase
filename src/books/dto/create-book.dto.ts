import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @ApiProperty()
  release: number;

  @IsNotEmpty()
  @ApiProperty()
  writer: string;

  @IsNotEmpty()
  @ApiProperty()
  bookname: string;

  @IsNotEmpty()
  @ApiProperty()
  genre: string;
}
