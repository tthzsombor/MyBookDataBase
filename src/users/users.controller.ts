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
  const emailHtml = `  
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
    
    <!-- Header with Logo -->
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="cid:logo-cid" alt="MyBook Logo" style="max-width: 150px;">
    </div>

    <h2 style="color: #007bff; text-align: center; font-size: 24px; margin-bottom: 15px;">Sikeres regisztráció</h2>
    
    <p style="text-align: center; font-size: 16px; margin-bottom: 20px;">Kedves <strong>${user.username}</strong>,</p>
    
    <p style="text-align: center; font-size: 16px; margin-bottom: 25px;">Köszönjük, hogy regisztráltál a MyBook rendszerbe!</p>

    <p style="text-align: center; font-size: 16px;">Most már bejelentkezhetsz, és elkezdheted felfedezni a könyvtárad kezelésének lehetőségeit.</p>

    <p style="text-align: center; margin-top: 20px;">
      <a href="http://localhost:5173/login" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold; box-shadow: 0 2px 5px rgba(0, 123, 255, 0.4); transition: all 0.3s;">
        Bejelentkezés
      </a>
    </p>

    <p style="text-align: center; font-size: 16px; margin-top: 30px;">Üdvözlettel,<br><strong>MyBook csapata</strong></p>

    <!-- Footer -->
    <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
    <p style="font-size: 12px; color: #777; text-align: center; margin-top: 15px;">
      Ezt az üzenetet automatikusan generáltuk, kérjük, ne válaszolj rá.
    </p>

  </div>
  `;

  await this.sendEmail(user.email, 'Sikeres regisztráció', emailHtml);
}

return {
  message: 'Felhasználó sikeresen regisztrálva',
  user,
};

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

      if (username) {
        const emailHtml = `  
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
          
          <!-- Header with Logo -->
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:logo-cid" alt="MyBook Logo" style="max-width: 150px;">
          </div>
      
          <h2 style="color: #d9534f; text-align: center; font-size: 24px; margin-bottom: 15px;">Fiók törlési értesítés</h2>
          
          <p style="text-align: center; font-size: 16px; margin-bottom: 20px;">Tisztelt <strong>${username}</strong>,</p>
          
          <p style="text-align: center; font-size: 16px; margin-bottom: 25px;">Értesítjük, hogy fiókját megpróbálták törölni. Amennyiben nem Ön kezdeményezte ezt a műveletet, kérjük, azonnal változtassa meg jelszavát fiókja biztonsága érdekében.</p>
      
          <p style="text-align: center; margin-top: 20px;">
            <a href="http://localhost:5173/jelszo-modositas" style="background-color: #d9534f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold; box-shadow: 0 2px 5px rgba(217, 83, 79, 0.4); transition: all 0.3s;">
              Jelszó módosítása
            </a>
          </p>
      
          <p style="text-align: center; font-size: 16px; margin-top: 30px;">Üdvözlettel,<br><strong>MyBook csapata</strong></p>
      
          <!-- Footer -->
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #777; text-align: center; margin-top: 15px;">
            Ezt az üzenetet automatikusan generáltuk, kérjük, ne válaszolj rá.
          </p>
      
        </div>
        `;
      
        await this.sendEmail(userToNotify.email, 'Törlési kísérlet', emailHtml);
      } else {
        console.error('Felhasználónév nem található.');
      }
      
      // Törlés a szolgáltatáson keresztül
      await this.usersService.remove(Number(id));
      
  
      return { message: 'Felhasználó törölve, értesítés elküldve.' };
    }

    // E-mail küldése a törölni kívánt felhasználónak
    const username = await this.usersService.returnusername(userToNotify.id);

    if (username) {
      const emailHtml = `  
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: auto;">
        
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:logo-cid" alt="MyBook Logo" style="max-width: 150px;">
        </div>
    
        <h2 style="color: #d9534f; text-align: center; font-size: 24px; margin-bottom: 15px;">Fiók törlése</h2>
        
        <p style="text-align: center; font-size: 16px; margin-bottom: 20px;">Tisztelt <strong>${username}</strong>,</p>
        
        <p style="text-align: center; font-size: 16px; margin-bottom: 25px;">Sajnálattal értesítjük, hogy fiókja törlésre került a rendszerünkből.</p>
    
        <p style="text-align: center; font-size: 16px; color: #555;">Amennyiben kérdése van, vagy úgy gondolja, hogy ez egy tévedés, kérjük, vegye fel velünk a kapcsolatot.</p>
    
        <p style="text-align: center; font-size: 16px; margin-top: 30px;">Üdvözlettel,<br><strong>MyBook csapata</strong></p>
    
        <!-- Footer -->
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #777; text-align: center; margin-top: 15px;">
          Ezt az üzenetet automatikusan generáltuk, kérjük, ne válaszolj rá.
        </p>
    
      </div>
      `;
    
      await this.sendEmail(userToNotify.email, 'Fiókja törölve lett', emailHtml);
    } else {
      console.error('Felhasználónév nem található.');
    }
    
    // Törlés a szolgáltatáson keresztül
    await this.usersService.remove(Number(id));
    

    return { message: 'Felhasználó törölve, értesítés elküldve.' };
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
