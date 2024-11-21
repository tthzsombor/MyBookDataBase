import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl, } from 'class-validator';

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

  @IsUrl()
  @ApiProperty({ description: 'URL to the book cover image' })
  image: string; // Új mező a kép URL-jéhez

  @ApiProperty()
  @IsOptional()
  opinion: string;

  @ApiProperty()
  @IsOptional()
  rating: number;
}
