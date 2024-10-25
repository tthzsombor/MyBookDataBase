import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma.service';
import { SetBookStatusDto } from './dto/setbookstatus.dto';
import { User } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Book } from './entities/book.entity';
import { AuthGuard } from '@nestjs/passport';
import { tr } from '@faker-js/faker';

@ApiTags('A könyvek api-ja')
@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly db: PrismaService,
  ) {}
  
  /**
   * Új könyvet alkot
   *
   * @param CreateBookDto
   * @returns
   */
  @Post('/Bookname')
  @ApiCreatedResponse({
    description: 'Sikeres lekérdezés',
    type: Book,
  })
  @ApiBadRequestResponse({
    description: 'Hiba történt',
  })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @ApiParam({
    name: 'Könyv címe',
    description: 'A címe a könyvnek, az adat nem egyedi',
    type: String,
  })
  @ApiOkResponse({
    description: 'A könyvek adatait adja vissza',
    type: Book,
  })
  @ApiNotFoundResponse({
    description: 'Nem talál ilyet',
  })
  @Get('SearchName')
  SearchAll() {
    return this.booksService.SearchAll();
  }
  @ApiParam({
    name: 'Könyv Írója',
    description: 'A író alapú könyvkeresés miatti, írót váró',
    type: String,
  })
  @ApiOkResponse({
    description: 'Az író alapú keresés sikeres',
    type: Book,
  })
  @ApiNotFoundResponse({
    description: 'Nincs ilyer író',
  })
  @Post('Author/:Author')
  getByAuthor(@Param('Author') author: string) {
    return this.booksService.getbyAuthor(author);
  }

  @ApiParam({
    name: 'Könyv Id-ja',
    description: 'A könyv frissítéséhez kellő Könyv id',
    type: String,
  })
  @ApiOkResponse({
    description: 'Sikeres frissítés',
    type: Book,
  })
  @ApiOkResponse({
    description: 'Sikeres frissítés',
    type: Book,
  })
  @ApiNotFoundResponse({
    description: 'Nem található könyv az adott ID-val',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @ApiParam({
    name: 'Könyv Id-ja',
    description: 'A könyv törléshez kellő Könyv id',
    type: String,
  })
  @ApiOkResponse({
    description: 'Sikeres törlés',
    type: Book,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }

  @ApiParam({
    name: 'id',
    description: 'Az ID-ja egy személyes könyvtárnak',
  })
  @ApiOkResponse({
    description: 'Megadott könyvet könyvtárba adja.',
    type: Book,
  })
  @Post('/Status/:id')
  @UseGuards(AuthGuard('bearer'))
  library(
    @Param('id') id: string,
    @Body() setbookstatusdto: SetBookStatusDto,
    @Request() req,
  ) {
    const user: User = req.user;
    return this.db.userBook.upsert({
      where: {
        userid_bookid: {
          userid: user.id,
          bookid: parseInt(id),
        },
      },
      create: {
        userid: user.id,
        bookid: parseInt(id),
        statusid: setbookstatusdto.status,
      },
      update: {
        statusid: setbookstatusdto.status,
      },
    });
  }

 
  @ApiOkResponse({
    description: 'Ki adja a bejelentkezett felhasználó egész könyvtárát',
    type: Book,
  })
  @Get('SearchUserBook/')
  @UseGuards(AuthGuard('bearer'))
  searchUserBook(@Request() req) {
    const user: User = req.user;
    return this.db.userBook.findMany({
      where: {
        userid: user.id,
      },
      include: {
        status: true,
        book: true,
      },
    });
  }

  @ApiOkResponse({
    description: 'Ki adja a bejelentkezett user egész könyvtárát',
    type: Book,
  })
  @Get('SearchBacklog/')
  @UseGuards(AuthGuard('bearer'))
  searchBacklog(@Request() req) {
    const user: User = req.user;
    return this.db.userBook.findMany({
      where: {
        userid: user.id,
        statusid: 1
        },
      include: {
        status: true,
        book: true,
      },
    });
  }
}



