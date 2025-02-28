import { Delete, HttpException, HttpStatus, Injectable, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginuserdto } from './dto/login.dto';
import { PrismaService } from 'src/prisma.service';
import { PrismaClient, UserBook } from '@prisma/client';
import * as argon2 from 'argon2';
import { tr } from '@faker-js/faker';
import { User } from '@prisma/client'; // Prisma User

@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) { }


  async updatePassword(userId: number, newPassword: string): Promise<void> {
    await this.db.user.update({
      where: { id: userId },
      data: { password: await argon2.hash(newPassword) }, // Hashed password
    });
  }

  async create(createUserDto: CreateUserDto) {
    return await this.db.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        password: await argon2.hash(createUserDto.password)
      },
    });
  }
  findByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
    });
  }
  // searchByName(username: string) {
  //   return this.db.user.findFirst({
  //     where: {
  //       username: username,
  //     },
  //   });
  // }

  findById(id: number){
    return this.db.user.findFirst({
      where:{
        id: id
      }
    })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.db.user.update({
      where: {
        id: id,
      },
      data: {
        email: updateUserDto.email,
        username: updateUserDto.username,
        password: updateUserDto.password
      },
    });
  }

  //felhasznalo torlese
  async remove(id: number) {
    const user = await this.db.user.findUnique({
      where: {
        id
      },
      include: {
        userbook: true,
        tokens: true
      }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Kapcsolódó adatok törlése
    await this.db.userBook.deleteMany({ where: { userid: id } });
    await this.db.token.deleteMany({ where: { userId: id } });

    // Felhasználó törlése
    return this.db.user.delete({ where: { id } });
  }



  async findUserBooksByBookId(bookId: number): Promise<UserBook[]> {
    return this.db.userBook.findMany({
        where: {
            bookid: bookId,
        },
    });
}

async returnusername(id: number): Promise<string | null> {
  const user = await this.findById(id); // Felhasználó keresése az ID alapján
  if (user) {
      return user.username; // Visszaadja a felhasználó nevét, ha létezik
  } else {
      console.error(`Felhasználó nem található az ID alapján: ${id}`);
      return null; // Ha nem található, null-t ad vissza
  }
}




  login(loginuserdto: loginuserdto) {
    return '';
  }

  findAll() {
    return this.db.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        role: true
      }
    })
  }


  
  async findAllUsersWithBooks() {
    return this.db.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        userbook: {
          select: {
            book: {
              select: {
                id: true,
                bookname: true,
                writer: true,
                release: true,
                genre: { select: { genrename: true } },
                image: true,
              },
            },
            status: { select: { statusname: true } },
            opinion: true,
            rating: true,
          },
        },
      },
    });
  }




//user adott könyve és annak adatai
async findUserWithBook(userId: number, bookId: number) {
  // Először lekérdezzük a felhasználót
  const user = await this.db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    console.log("Nem található felhasználó a megadott ID-vel: "+userId);
    return null;
  }

  // Ezután lekérdezzük a userbook táblát
  const userBook = await this.db.userBook.findFirst({
    where: {
      userid: userId,
      bookid: bookId,
    },
    select: {
      book: {
        select: {
          id: true,
          bookname: true,
          writer: true,
          release: true,
          genre: { select: { genrename: true } },
          image: true,
        },
      },
      status: { select: { statusname: true } },
      opinion: true,
      rating: true,
    },
  });

  if (!userBook) {
    console.log("Nem található könyv a felhasználó könyvtárában.");
    return null;
  }

  // Ha minden rendben, összeállítjuk az eredményt
  return {
    ...user,
    userbook: userBook,
  };
}
  
  
  
}
