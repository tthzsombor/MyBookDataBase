import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma.service';
import { th } from '@faker-js/faker';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(private readonly db: PrismaService) {}

  create(createBookDto: CreateBookDto) {
    return this.db.books.create({
      data: {
        bookname: createBookDto.bookname,
        writer: createBookDto.writer,
        release: createBookDto.release,
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
      where: {
        id: id,
      },
      data: {
        ...updateBookDto.genre ? {
          genre: {
            connectOrCreate: {
              where: {
                genrename: updateBookDto.genre,
              },
              create: {
                genrename: updateBookDto.genre,
              },
            },
          },
        } : {},
        bookname: updateBookDto.bookname,
        writer: updateBookDto.writer,
        release: updateBookDto.release,
      },
    });
  }
  
  remove(id: number) {
    return this.db.userBook.deleteMany({
      where: {
        bookid: id, // A törlendő könyv ID-ja
      },
    }).then(() => {
      // Ezután töröljük a könyvet
      return this.db.books.delete({
        where: {
          id: id,
        },
      });
    });
  }

  SearchAll(){
    return this.db.books.findMany()
  }
  getbyAuthor(author: string){
    return this.db.books.findMany({
      where: { writer: {
        contains: author
      } },
    });
  }

  searchUserBook(id: string){
    return this.db.userBook.findMany({
      where:{
        userid: parseInt(id)
      }
    })
  }
}


