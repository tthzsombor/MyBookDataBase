import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  ForbiddenException,
  Query,
  Search,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginuserdto } from './dto/login.dto';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { query } from 'express';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/admin.guard'; // Admin guard importálása
import * as nodemailer from 'nodemailer';





@ApiTags('Api of the users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  

  // Admin felhasználók számára
  @Get()
  async findAll() {
    return this.usersService.findAll(); // Minden felhasználó lekérdezése
  }

  @ApiParam({
    name: 'Token',
    description: 'The token of a user',
  })
  @ApiCreatedResponse({
    description: 'Successfully find yourself'
  })
  @ApiBadRequestResponse({
    description: 'An error occured'
  })
  @Get('me')
  @UseGuards(AuthGuard('bearer'))
  me(@Request() req) {
    const user: User = req.user;
    return {
      id:user.id, //ID visszaadása az admin törléshez
      username: user.username,
      email: user.email,
    };
  }
  /**
   * Creates a new user
   * 
   * @param CreateUserDto 
   * @returns 
   */
  @Post('Register')
async create(@Body() createUserDto: CreateUserDto) {
  const user = await this.usersService.create(createUserDto); // Felhasználó létrehozása

  // E-mail küldése a regisztrációnál
  if (user) {
    await this.sendREmail(
      user.email,
      'Sikeres regisztráció',
      `Kedves ${user.username},\n\nKöszönjük, hogy regisztráltál a MyBook rendszerbe!\n\nMostantól könnyedén hozzáadhatod könyveidet, kezelheted azokat, és felfedezheted más felhasználók könyvtárát.\n\nÜdvözlettel:\nMyBook csapat`
    );
  }

  return {
    message: 'Felhasználó sikeresen regisztrálva',
    user,
  };
}

// E-mail küldése
private async sendREmail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL_ADDRESS, // Gmail fiók
      pass: process.env.EMAIL_PASSWORD, // Gmail alkalmazásjelszó
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to,
    subject,
    text,
  });
}


  @ApiParam({
    name: 'Name',
    description: 'The Name of a user',
  })
  @ApiCreatedResponse({
    description: 'Successfully find the user'
  })
  @ApiBadRequestResponse({
    description: 'An error occured'
  })
  // @Get(':name')
  // searchUsersByUsername(@Param('name') name: string) {
  //   return this.usersService.searchByName; (name);
  // }


  @ApiParam({
    name: 'User Id-ja',
    description: 'A Felhasználó frissítéséhez kellő felhasználó id',
    type: String,
  })
  @ApiOkResponse({
    description: 'Sikeres frissítés',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiParam({
    name: 'User Id-ja',
    description: 'A Felhasználó törléséhez kellő felhasználó id',
    type: String,
  })
  @ApiOkResponse({
    description: 'Sikeres törlés',
  })

  
  //@Delete(':id')
   // async remove(@Param('id') id: string) {
   //     return this.usersService.remove(Number(id)); // Típuskonverzió
   // }

   
   @Delete(':id')
async remove(@Param('id') id: number) {
    const userToNotify: User = await this.usersService.findById(Number(id));

    if (!userToNotify) {
        throw new NotFoundException('Felhasználó nem található');
    }
    if(userToNotify.role=="ADMIN"){
      const username = await this.usersService.returnusername(userToNotify.id);

      if (username) { // Ellenőrizzük, hogy a username nem null
        await this.sendEmail(
          userToNotify.email,
          'Törlési kísérlet',
          `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #d9534f;">Fiók Törlési Értesítés</h2>
              <p>Tisztelt <strong>${username}</strong>,</p>
              <p>Értesítjük, hogy fiókját megpróbálták törölni. Amennyiben nem Ön volt, kérjük, változtasson jelszót.</p>
              <p>Üdvözlettel,<br><strong>MyBook csapata</strong></p>
            </div>
          `
        );
        
      } else {
          console.error('Felhasználónév nem található.'); // Hibakezelés, ha a felhasználó nem található
      }
  
      // Törlés a szolgáltatáson keresztül
      await this.usersService.remove(Number(id));
  
      return { message: 'Felhasználó törölve, értesítés elküldve.' };
    }

    // E-mail küldése a törölni kívánt felhasználónak
    const username = await this.usersService.returnusername(userToNotify.id);

    if (username) { // Ellenőrizzük, hogy a username nem null
      await this.sendEmail(
        userToNotify.email,
        'Fiókja törölve lett',
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #d9534f;">Fiók Törlése</h2>
            <p>Tisztelt <strong>${username}</strong>,</p>
            <p>Értesítjük, hogy fiókját töröltük.</p>
            <p>Kérdés esetén keressen minket.</p>
            <p>Üdvözlettel,<br><strong>MyBook csapata</strong></p>
          </div>
        `
      );
      
    } else {
        console.error('Felhasználónév nem található.'); // Hibakezelés, ha a felhasználó nem található
    }

    // Törlés a szolgáltatáson keresztül
    await this.usersService.remove(Number(id));

    return { message: 'Felhasználó törölve, értesítés elküldve.' };
}
   

    //Törlés esetén email
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
          });
          console.log('E-mail sikeresen elküldve.'); // E-mail küldése sikeres
      } catch (error) {
          console.error('Hiba történt az e-mail küldésekor:', error); // Hibakezelés
      }
  }





  private async AdminEmail(to: string, subject: string, text: string) {
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
            text,
        });
        console.log('E-mail sikeresen elküldve.'); // E-mail küldése sikeres
    } catch (error) {
        console.error('Hiba történt az e-mail küldésekor:', error); // Hibakezelés
    }
}
  

  //Visszaadja az összes felhasználót és a hozzájuk tartozó könyveket.
  @Get('with-books')
async findAllUsersWithBooks() {
  try {
    const usersWithBooks = await this.usersService.findAllUsersWithBooks();
    return usersWithBooks; // Automatikusan JSON formátumban visszaadva
  } catch (error) {
    console.error('Backend hiba:', error);
    throw new Error('Hiba a felhasználók és könyveik lekérésekor');
  }
}



}
