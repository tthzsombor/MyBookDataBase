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
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { SetBookStatusDto } from './dto/setbookstatus.dto';
import { User, UserBook } from '@prisma/client';
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
import * as nodemailer from 'nodemailer';



@ApiTags('A könyvek api-ja')
@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
    private readonly db: PrismaService,
  ) { }

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
  @Put(':id')
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
  async remove(@Param('id') id: number) {
    const book = await this.booksService.findBookById(+id); // Könyv keresése ID alapján

    if (!book) {
      throw new NotFoundException('Könyv nem található');
    }

    const userBooks: UserBook[] = await this.usersService.findUserBooksByBookId(book.id);

    // Ha van felhasználó, akinek van ilyen könyve, értesítést küldünk
    if (userBooks.length > 0) {
      for (const userBook of userBooks) {
        const userToNotify = await this.usersService.findById(userBook.userid);
        const username = await this.usersService.returnusername(userBook.userid);
        if (userToNotify) {
          // E-mail küldése a felhasználónak a törlésről
          await this.sendEmail(
            userToNotify.email,
            'Könyv törlése',
            `Tisztelt ${username},\n\nA következő könyv törlésre került: ${book.writer} - ${book.bookname}.\n\nKérjük, ne habozzon kapcsolatba lépni, ha bármilyen kérdése van.\n\nÜdvözlettel:\nMyBook`
          );
        }
      }
    }

    // Könyv törlése
    await this.booksService.remove(+id);

    return { message: 'Könyv törölve.' }; // Visszaadjuk a törlés eredményét
  }


  // E-mail küldése
  private async sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // SMTP szerver címe
      port: 587, // SMTP port
      auth: {
        user: process.env.EMAIL_ADDRESS, // Gmail fiók
        pass: process.env.EMAIL_PASSWORD, // Gmail alkalmazásjelszó
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_ADDRESS, // Ki küldi
      to,
      subject,
      text,
    });
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
  async searchUserBook(@Request() req) {
    const user: User = req.user;
    const userBooks = await this.db.userBook.findMany({
      where: {
        userid: user.id,
      },
      include: {
        status: true,
        book: {
          include: {
            genre: true, 
          },
        },
      },
    });

    return userBooks.map(userBook => ({
      ...userBook,
      book: {
        ...userBook.book,
        genre: userBook.book.genre?.genrename
      },
    }));
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


  // Vélemény létrehozása
  @Post('opinion-and-rating')
async createOpinionAndRating(@Body() body: { userId: number; bookId: number; opinion: string; rating: number }) {
    const { userId, bookId, opinion, rating } = body;

    // Validáció
    if (!userId || !bookId || !opinion || typeof rating !== 'number' || rating < 1 || rating > 5) {
        throw new BadRequestException('Hibás vagy hiányzó paraméterek');
    }

    return await this.booksService.createOpinionAndRating(userId, bookId, opinion, rating);
}

  // Vélemények lekérdezése egy adott könyvről
  @Get('opinions-and-ratings/:bookId')
async getOpinionsAndRatings(@Param('bookId') bookId: number) {
    return await this.booksService.getOpinionsAndRatingsByBookId(bookId);
}

  @Delete('opinion-and-rating')
async deleteOpinionAndRating(@Body() body: { userId: number; bookId: number }) {
    const { userId, bookId } = body;

    // Validáció
    if (!userId || !bookId || typeof userId !== 'number' || typeof bookId !== 'number') {
        throw new BadRequestException('Hibás vagy hiányzó paraméterek');
    }

    return await this.booksService.removeOpinionAndRating(userId, bookId);
}
  
  
@Get()
  async getAllBooks() {
    return this.booksService.getAllBooksWithOpinions();
  }
  


}