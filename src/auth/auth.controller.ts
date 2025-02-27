import { loginuserdto } from 'src/users/dto/login.dto';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { BadRequestException, Body, Controller, Get, HttpCode, InternalServerErrorException, Param, Post, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { verify } from 'argon2';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { Response } from 'express';



@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly db: PrismaService,

  ) { }

  @Post('login')
  async login(@Body() loginDto: loginuserdto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (user == null) {
      throw new UnauthorizedException('Hibás email vagy jelszó!');
    }
    if (!await verify(user.password, loginDto.password)) {
      throw new UnauthorizedException('Hibás email vagy jelszó!');
    }

    return {
      token: await this.authService.generateTokenFor(user),
    };
  }

  @Post('adminlogin')
  async adminLogin(@Body() loginDto: loginuserdto) {
    const admin = await this.authService.findAdminByEmail(loginDto.email);
    if (admin == null) {
      throw new UnauthorizedException('Hibás email vagy!');
    }
    if (!await verify(admin.password, loginDto.password)) {
      throw new UnauthorizedException('Hibás email vagy jelszó!');
    }

    return {
      token: await this.authService.generateTokenFor(admin),
    };
  }


  @Post('logout')
  @UseGuards(AuthGuard('bearer'))
  @HttpCode(204)
  logout(@Request() req) {
    const token = req.user.token;
    return this.authService.revokeToken(token);
  }



// Jelszó visszaállítási kérés
@Post('request-password-reset')
async requestPasswordReset(@Body('email') email: string) {
  // Loggolás: megérkezett e-mail cím
  console.log("Jelszó visszaállítási kérés érkezett az e-mail címről:", email);
  
  if (!email) {
    throw new BadRequestException('Kérjük, adja meg az e-mail címet.');
  }

  try {
    await this.authService.requestPasswordReset(email);
    // Sikeres e-mail küldés
    console.log("E-mail küldve a jelszó visszaállításához:", email);
    return { message: 'Az e-mailt elküldtük a jelszó visszaállításához, ha a felhasználó létezik.' };
  } catch (error) {
    // Hiba esetén loggolás
    console.error("Hiba történt a jelszó visszaállítási e-mail küldésekor:", error);
    throw new InternalServerErrorException('Hiba történt az e-mail küldése során.');
  }
}




  @Get('reset-password/:token')
  async redirectToResetPage(@Param('token') token: string, @Res() res: Response) {
    console.log("Received token:", token);
      const isValid = await this.authService.validateResetToken(token);
      console.log("Is token valid?", isValid);  
      if (!isValid) {
          throw new BadRequestException('Érvénytelen vagy lejárt token.');
      }
      return res.redirect(`http://localhost:5173/uj-jelszo/${token}`); 
  }




  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;

    // Token érvényességének ellenőrzése és felhasználó keresése
    const tokenObj = await this.db.token.findUnique({
      where: { token },
    });

    if (!tokenObj || !tokenObj.resetTokenExpiration || new Date() > tokenObj.resetTokenExpiration) {
      throw new BadRequestException('Érvénytelen vagy lejárt token.');
    }

    // Felhasználó keresése a token alapján
    const user = await this.db.user.findUnique({
      where: { id: tokenObj.userId },
    });

    if (!user) {
      throw new BadRequestException('Felhasználó nem található.');
    }

    // Jelszó frissítése a felhasználónak
    await this.usersService.updatePassword(user.id, newPassword);

    return { message: 'A jelszó sikeresen megváltozott.' };
  }



  






}
