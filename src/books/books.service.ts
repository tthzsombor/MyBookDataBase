import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma.service';
import { id_ID, th, tr } from '@faker-js/faker';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(private readonly db: PrismaService) { }

  create(createBookDto: CreateBookDto) {
    return this.db.books.create({
      data: {
        bookname: createBookDto.bookname,
        writer: createBookDto.writer,
        release: createBookDto.release,
        image: createBookDto.image,
        genre: { // Most a 'genre' mező a helyes
          connect: {
            genrename: createBookDto.genre, // A műfaj nevét használjuk a kapcsolathoz
          },
        },
      },
      include: {
        genre: true, // Visszakapjuk a műfaj adatokat is
      },
    });
  }





  update(id: number, updateBookDto: UpdateBookDto) {
    return this.db.books.update({
      where: { id: id },
      data: {
        bookname: updateBookDto.bookname,
        writer: updateBookDto.writer,
        release: updateBookDto.release,
        image: updateBookDto.image, // Az új mező
        ...(updateBookDto.genre && {
          genre: {
            connect: {
              genrename: updateBookDto.genre, // A műfaj nevét használjuk a kapcsolathoz
            },
          },
        }),
      },
      include: {
        genre: true, // Visszakapjuk a frissített műfaj adatokat is
      },
    });
  }


  //Könyv törlése
  // remove(id: number) {
  // return this.db.userBook.deleteMany({
  // where: {
  //  bookid: id, // A törlendő könyv ID-ja
  // },
  // }).then(() => {
  // Ezután töröljük a könyvet
  // return this.db.books.delete({
  //  where: {
  //   id: id,
  //  },
  //  });
  //  });
  // }

  async remove(id: number) {
    const book = await this.db.books.findUnique({
      where: {
        id: id
      },
      include: {
        userbook: true
      }
    });

    if (!book) {
      throw new NotFoundException('Book not found');

    }

    await this.db.userBook.deleteMany({ where: { bookid: id } })
    await this.db.books.delete({ where: { id: id } })

  }

  findBookById(Id: number) {
    console.log('Finding book with ID:', Id); // Debugging
    return this.db.books.findUnique({
        where: {
            id: Id
        },
    });
}


  getByGenre(genre: string) {
    return this.db.books.findMany({
      where: {
        genre: {
          genrename: genre, // Most a genre-t használjuk közvetlenül
        },
      },
      include: {
        genre: true, // Visszaadjuk a műfaj adatokat is
      },
    });
  }



  async SearchAll() {
    const books = await this.db.books.findMany({
      include: {
        genre: true, // Beillesztjük a genre információkat
      },
    });

    // Átalakítjuk a válasz struktúráját
    return books.map(book => ({
      id: book.id,
      bookname: book.bookname,
      writer: book.writer,
      release: book.release,
      image: book.image,
      genre: book.genre ? book.genre.genrename : null, // Itt adjuk vissza a genrename-t
    }));
  }

  getbyAuthor(author: string) {
    return this.db.books.findMany({
      where: {
        writer: {
          contains: author
        }
      },
    });
  }

  searchUserBook(id: string) {
    return this.db.userBook.findMany({
      where: {
        userid: parseInt(id),
      },
      include: {
        book: {
          include: {
            genre: true, // Lekérdezzük a genre információt
          },
        },
      },
    });
  }


  // Vélemény létrehozása
  async createOpinion(userId: number, bookId: number, opinion: string) {
    return this.db.userBook.update({
      where: {
        userid_bookid: {
          userid: userId,
          bookid: bookId,
        },
      },
      data: {
        opinion: opinion,
      },
    });
  }

  // Vélemény lekérdezése egy adott könyvről
  async getOpinionsByBookId(bookId: number) {
    return this.db.userBook.findMany({
      where: {
        bookid: bookId,
        opinion: {
          not: null, // Csak a meglévő véleményeket kérdezzük le
        },
      },
      include: {
        user: true, // A felhasználói információk visszaadása
        book: true, // A könyv információk visszaadása
      },
    });
  }

  async removeOpinion(userId: number, bookId: number) {
    console.log('Removing opinion for User ID:', userId, 'and Book ID:', bookId); // Debugging

    if (!userId || !bookId || typeof userId !== 'number' || typeof bookId !== 'number') {
        throw new Error('Invalid or missing parameters: userId or bookId');
    }

    const userBook = await this.db.userBook.findUnique({
        where: {
            userid_bookid: {
                userid: userId,
                bookid: bookId,
            },
        },
    });

    if (!userBook) {
        throw new Error('UserBook entry not found');
    }

    return this.db.userBook.update({
        where: {
            userid_bookid: {
                userid: userId,
                bookid: bookId,
            },
        },
        data: {
            opinion: null, // Vélemény törlése
        },
    });
}




}


