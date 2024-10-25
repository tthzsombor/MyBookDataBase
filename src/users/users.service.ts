import { Delete, HttpException, HttpStatus, Injectable, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginuserdto } from './dto/login.dto';
import { PrismaService } from 'src/prisma.service';
import { PrismaClient } from '@prisma/client';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly db: PrismaService) { }

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
  searchByName(username: string) {
    return this.db.user.findFirst({
      where: {
        username: username,
      },
    });
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

}
