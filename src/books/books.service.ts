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
        genre: {
          connectOrCreate: {
            where: {
              genrename: createBookDto.genre,
            },
            create: {
              genrename: createBookDto.genre
            },
          },
        },
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
        image: updateBookDto.image, // Új mező hozzáadása
        ...(updateBookDto.genre && {
          genre: {
            connectOrCreate: {
              where: { genrename: updateBookDto.genre },
              create: { genrename: updateBookDto.genre },
            },
          },
        }),
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

  async remove(id: number){
    const book = await this.db.books.findUnique({
      where: {
        id: id
      },
      include:{
        userbook: true
      }
    });

    if(!book){
      throw new NotFoundException('Book not found');

    }

    await this.db.userBook.deleteMany({where: {bookid: id}})
    await this.db.books.deleteMany({where: {id: id}})
  }

  findById(id: number){
    return this.db.books.findFirst({
      where:{
        id: id
      }
    })
  }



  SearchAll() {
    return this.db.books.findMany()
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
        userid: parseInt(id)
      }
    })
  }
}


