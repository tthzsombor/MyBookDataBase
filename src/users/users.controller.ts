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
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
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
  @Get(':name')
  searchUsersByUsername(@Param('name') name: string) {
    return this.usersService.searchByName; (name);
  }


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
   async remove(@Param('id') id: Number) {
     const userToNotify: User = await this.usersService.findById(Number(id)); // Felhasználó keresése az ID alapján
 
     if (!userToNotify) {
       throw new NotFoundException('Felhasználó nem található');
     }
 
     // Törlés a szolgáltatáson keresztül
     await this.usersService.remove(Number(id)); // Típuskonverzió
 
     // E-mail küldése a törölt felhasználónak
     await this.sendEmail(
       userToNotify.email,
       'Fiókja törölve lett',
       'Sajnáljuk, de a fiókja törlésre került. Ha kérdése van, lépjen kapcsolatba az adminisztrátorral.',
     );
 
     return { message: 'Felhasználó törölve, értesítés elküldve.' }; // Visszaadjuk az értesítés eredményét
   }

    //Törlés esetén email
    // E-mail küldése
  private async sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // SMTP szerver címe
      port: 587, // SMTP port
      auth: {
        user: "zsombortoooth@gmail.com", // Gmail fiók
        pass: "wdmz onkv hbxm onxq", // Gmail alkalmazásjelszó
      },
    });

    await transporter.sendMail({
      from: "zsombortoooth@gmail.com", // Ki küldi
      to,
      subject,
      text,
    });
  }



}
