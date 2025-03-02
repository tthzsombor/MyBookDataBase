import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma.service';
import { id_ID, th, tr } from '@faker-js/faker';
import { Book } from './entities/book.entity';
import { connect } from 'http2';

@Injectable()
export class BooksService {
  findById(bookId: number) {
    throw new Error('Method not implemented.');
  }
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

  //Könyv keresése ID alapján
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


  searchUserBookOpinion(userId: number, bookId: number) {
    return this.db.userBook.findFirst({
      where: {
        userid: userId,
        bookid: bookId, // Lekérjük azt a könyvet, amit törölni akarunk
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




  // Vélemény és értékelés létrehozása
async createOpinionAndRating(userId: number, bookId: number, opinion: string, rating: number) {
  if (rating < 1 || rating > 5) {
      throw new Error('Értékelésnek 1 és 5 közötti számnak kell lennie');
  }

  return this.db.userBook.update({
      where: {
          userid_bookid: {
              userid: userId,
              bookid: bookId,
          },
      },
      data: {
          opinion: opinion,  // Vélemény beállítása
          rating: rating,    // Csillagos értékelés beállítása
      },
  });
}


  // Vélemények és értékelések lekérdezése egy adott könyvről
async getOpinionsAndRatingsByBookId(bookId: number) {
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


// Vélemény és értékelés törlése
async removeOpinionAndRating(userId: number, bookId: number) {
  // Ellenőrizzük, hogy létezik-e a rekord
  const userBook = await this.db.userBook.findUnique({
      where: {
          userid_bookid: {
              userid: userId,
              bookid: bookId,
          },
      },
  });

  // Ha nincs ilyen rekord, akkor null-t adunk vissza, hogy a controller tudja kezelni
  if (!userBook) {
      return null;  // Nincs ilyen rekord
  }

  // Vélemény és értékelés törlése
  return this.db.userBook.update({
      where: {
          userid_bookid: {
              userid: userId,
              bookid: bookId,
          },
      },
      data: {
          opinion: null,  // Vélemény törlése
          rating: null,   // Csillagos értékelés törlése
      },
  });
}




 // Az összes könyv adatának lekérése, véleményekkel és átlagos értékeléssel
 async getAllBooksWithOpinions() {
  const books = await this.db.books.findMany({
    include: {
      genre: true,
      userbook: {
        include: {
          user: {
            select:{
              id: true,
              username: true
            }
          }
        },
      },
    },
  });

  

  // Vélemények és átlagos értékelés számítása
  const booksWithRatings = await Promise.all(books.map(async (book) => {
    const opinions = book.userbook.filter((userBook) => userBook.opinion);
    const ratings = opinions.map((userBook) => userBook.rating);

    const averageRating = ratings.length 
      ? ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length
      : 0;

    return {
      ...book,
      genre: book.genre? book.genre.genrename:null,
      opinions: opinions.map(opinion => ({
        userName: opinion.user.username,
        opinion: opinion.opinion,
        rating: opinion.rating,
      })),
      averageRating: averageRating.toFixed(2),
    };
  }));

  return booksWithRatings;
}



// Top 5 legjobban értékelt könyv lekérése
async getTop5RatedBooks() {
  const books = await this.db.books.findMany({
    include: {
      genre: true,
      userbook: {
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        },
      },
    },
  });

  // Vélemények és átlagos értékelés számítása
  const booksWithRatings = await Promise.all(books.map(async (book) => {
    const opinions = book.userbook.filter((userBook) => userBook.opinion);
    const ratings = opinions.map((userBook) => userBook.rating);

    const averageRating = ratings.length
      ? ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length
      : 0;

    return {
      ...book,
      genre: book.genre ? book.genre.genrename : null,
      opinions: opinions.map(opinion => ({
        userName: opinion.user.username,
        opinion: opinion.opinion,
        rating: opinion.rating,
      })),
      averageRating: averageRating.toFixed(2),
    };
  }));

  // Top 5 legjobban értékelt könyv visszaadása
  const top5Books = booksWithRatings
    .sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating)) // Rendezés a legnagyobb átlag alapján
    .slice(0, 5); // Csak az első 5 könyv

  return top5Books;
}



}


