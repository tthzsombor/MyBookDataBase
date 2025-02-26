import { loginuserdto } from 'src/users/dto/login.dto';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { BadRequestException, Body, Controller, Get, HttpCode, Param, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { verify } from 'argon2';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
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
    if (!email) {
      throw new BadRequestException('Kérjük, adja meg az e-mail címet.');
    }
    await this.authService.requestPasswordReset(email);
    return { message: 'Az e-mailt elküldtük a jelszó visszaállításához, ha a felhasználó létezik.' };
  }




  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    const { token, newPassword } = body;

    // Token érvényességének ellenőrzése
    const userIdString = await this.authService.validateResetToken(token);
    if (!userIdString) {
      throw new BadRequestException('Érvénytelen vagy lejárt token.');
    }

    // A userId konvertálása számmá, ha szükséges
    const userId = parseInt(userIdString, 10); // Vagy Number(userIdString)

    // Jelszó frissítése a felhasználónak
    await this.usersService.updatePassword(userId, newPassword);

    return { message: 'A jelszó sikeresen megváltozott.' };
  }


  @Get('reset-password/:token')
  async validateResetToken(@Param('token') token: string) {
    const isValid = await this.authService.validateResetToken(token);
    if (!isValid) {
      throw new BadRequestException('Érvénytelen vagy lejárt token.');
    }
    
    return { message: 'Token érvényes. Jelszó visszaállításra kész.' };
  }
  



}
