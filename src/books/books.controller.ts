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
import { writer } from 'repl';
import { log } from 'console';



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


  @Delete('deletebook/:id')
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
          const emailHtml = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
            
            <!-- Header with Logo -->
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="cid:logo-cid" alt="MyBook Logo" style="max-width: 150px;">
            </div>
        
            <h2 style="color: #d9534f; text-align: center; font-size: 24px; margin-bottom: 15px;">Könyv Törlése</h2>
            
            <p style="text-align: center; font-size: 16px; margin-bottom: 20px;">Tisztelt <strong>${username}</strong>,</p>
            
            <p style="text-align: center; font-size: 16px; margin-bottom: 15px;">Ezúton értesítjük, hogy az alábbi könyv törlésre került:</p>
        
            <div style="background-color: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); margin-bottom: 20px; text-align: center;">
              <img src="${book.image}" alt="${book.bookname}" style="max-width: 150px; border-radius: 5px; margin-bottom: 10px;">
              <p style="font-size: 16px; margin: 0;"><strong>Író:</strong> ${book.writer}</p>
              <p style="font-size: 16px; margin: 0;"><strong>Cím:</strong> ${book.bookname}</p>
              <p style="font-size: 16px; margin: 0;"><strong>Kiadási év:</strong> ${book.release}</p>
            </div>
        
            <p style="text-align: center; font-size: 16px; margin-bottom: 25px;">Ha ez Ön szerint hiba, vagy kérdése van, ne habozzon kapcsolatba lépni velünk.</p>
        
            <p style="text-align: center; font-size: 16px; margin-top: 30px;">Üdvözlettel,<br><strong>MyBook csapata</strong></p>
        
            <!-- Footer -->
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #777; text-align: center; margin-top: 15px;">
              Ezt az üzenetet automatikusan generáltuk, kérjük, ne válaszolj rá.
            </p>
        
          </div>
        `;

          await this.sendEmail(userToNotify.email, 'Könyv törlése', emailHtml);

        }

        // Könyv törlése
        await this.booksService.remove(+id);
      }
    }

    return { message: 'Könyv törölve.' }; // Visszaadjuk a törlés eredményét
  }


  // E-mail küldése
  private async sendEmail(to: string, subject: string, html: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to,
        subject,
        html,
        attachments: [
          {
            filename: 'mybookkek.png',
            path: './public/mybookkek.png', // vagy teljes elérési út, ha szükséges
            cid: 'logo-cid',
          },
        ],
      });
      console.log('E-mail sikeresen elküldve.');
    } catch (error) {
      console.error('Hiba történt az e-mail küldésekor:', error);
    }
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

  // Vélemény törlése
  @Delete('opinion-and-rating')
  async deleteOpinionAndRating(@Body() body: { userId: number; bookId: number }) {
    const { userId, bookId } = body;

    // Validáció
    if (!userId || !bookId || typeof userId !== 'number' || typeof bookId !== 'number') {
      throw new BadRequestException('Hibás vagy hiányzó paraméterek');
    }

    // Hívás a szolgáltatásban
    const result = await this.booksService.removeOpinionAndRating(userId, bookId);

    if (!result) {
      throw new NotFoundException('A megadott könyv és felhasználó kombinációval nincs vélemény vagy értékelés');
    }

    return result;
  }




  // Vélemény törlése
  @Delete('admin-opinion-and-rating')
  async adminDeleteOpinionAndRating(@Body() body: { userId: number; bookId: number }) {
    const { userId, bookId } = body;

    // Validáció
    if (!userId || !bookId || typeof userId !== 'number' || typeof bookId !== 'number') {
      throw new BadRequestException('Hibás vagy hiányzó paraméterek');
    }

    // Felhasználó könyvének keresése
    const felhasznalokonyve = await this.usersService.findUserWithBook(userId, bookId);



    if (!felhasznalokonyve || !felhasznalokonyve.userbook || !felhasznalokonyve.userbook.book) {
      throw new NotFoundException('A keresett könyv nem található a felhasználó könyvtárában.');
    }
    const userBook = felhasznalokonyve.userbook; // Az első elem a keresett könyv adatainak a helye

    // Könyv adatainak elérése
    const book = await this.booksService.findBookById(bookId); // Könyv keresése ID alapján

    const bookName = userBook.book.bookname;
    const writer = userBook.book.writer;
    const genre = userBook.book.genre.genrename; // Műfaj
    const release = userBook.book.release;
    const opinion = userBook.opinion; // Vélemény
    const rating = userBook.rating; // Értékelés

    // Függvény, ami a numerikus értéket csillagokkal jeleníti meg
    const getRatingStars = (rating) => {
      const fullStars = '★'.repeat(rating); // A teljes csillagok száma
      const emptyStars = '☆'.repeat(5 - rating); // A üres csillagok száma
      return fullStars + emptyStars; // Összeállítja a csillagokat
    }

    // A csillagok sárga színnel
    const ratingStars = `<span style="color: yellow; font-size:23px">${getRatingStars(rating)}</span>`;


    // Logolás a könyv adatairól
    console.log('Könyv adatai:', { bookName, writer, genre, release, opinion, rating });

    // Hívás a szolgáltatásban
    const result = await this.booksService.removeOpinionAndRating(userId, bookId);

    // Logolás a törlés eredménye előtt
    console.log('Törlés eredménye:', result);

    // E-mail küldése a felhasználónak
    const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
      
      <!-- Header with Logo -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="cid:logo-cid" alt="MyBook Logo" style="max-width: 150px;">
      </div>
  
      <h2 style="color: #d9534f; text-align: center; font-size: 24px; margin-bottom: 15px;">Vélemény Törlése</h2>
  
      <p style="font-size: 16px; text-align: center; margin-bottom: 20px;">Tisztelt <strong>${felhasznalokonyve.username}</strong>,</p>
  
      <p style="font-size: 16px; text-align: center; margin-bottom: 15px;">Ezúton értesítjük, hogy az alábbi könyv <b>véleménye</b> és <b>értékelése</b> eltávolításra került az adminisztrátor által:</p>
  
      <!-- Book Details -->
      <div style="background-color: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); margin-bottom: 20px; text-align: center;">
        <img src="${book.image}" alt="${book.bookname}" style="max-width: 150px; border-radius: 5px; margin-bottom: 10px;">
        <p style="font-size: 16px; margin: 0;"><strong>Cím:</strong> ${bookName}</p>
        <p style="font-size: 16px; margin: 0;"><strong>Cím:</strong> ${writer}</p>
        <p style="font-size: 16px; margin: 0;"><strong>Műfaj:</strong> ${genre}</p>
        <p style="font-size: 16px; margin: 0;"><strong>Kiadás:</strong> ${release}</p>
        <p style="font-size: 16px; margin: 0;"><strong>Vélemény:</strong> <i>${opinion}</i></p>
        <p style="font-size: 16px; margin: 0;"><strong>Értékelés:</strong> ${ratingStars}</p>
      </div>
  
      <p style="text-align: center; font-size: 16px; margin-top: 20px;">Ha kérdése van, ne habozzon kapcsolatba lépni velünk.</p>
  
      <p style="text-align: center; font-size: 16px; margin-top: 30px;">Üdvözlettel,<br><strong>MyBook csapata</strong></p>
  
      <!-- Footer -->
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #777; text-align: center; margin-top: 15px;">
        Ezt az üzenetet automatikusan generáltuk, kérjük, ne válaszolj rá.
      </p>
    </div>
  `;

    // E-mail küldése
    await this.sendEmail(
      felhasznalokonyve.email, // A felhasználó e-mail címe
      'Vélemény Törlése',
      emailHtml, // A törlésről szóló üzenet
    );

    // Logolás az e-mail küldés előtt
    console.log(`E-mail küldése a következő címre: ${felhasznalokonyve.email}`);

    return {
      message: 'A vélemény és értékelés törlésre került.',
      result,
    };

  }






  @Get('konyvekertekelessel')
  async getAllBooks() {
    return this.booksService.getAllBooksWithOpinions();
  }



  @Get('top-rated')
  async getTopRatedBooks() {
    return this.booksService.getTop9RatedBooks();
  }

}