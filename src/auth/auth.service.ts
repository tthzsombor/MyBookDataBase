import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';
import { hash } from 'argon2';
import { verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();



@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwtService: JwtService, // JWT Service hozzáadása
  ) { }

  // Jelszó hashelése
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // Jelszó ellenőrzése
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Token generálása felhasználó számára (JWT)
  async generateJwtToken(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }

  // Token generálása random (a meglévő funkció)
  async generateTokenFor(user: User) {
    const randomBuffer = randomBytes(32);
    const randomString = randomBuffer.toString('hex');

    await this.db.token.create({
      data: {
        token: randomString,
        userId: user.id,
      },
    });

    return randomString;
  }



  // Felhasználó keresése token alapján
  async findUserByToken(token: string) {
    const tokenObj = await this.db.token.findUnique({
      where: { token },
    });
    if (tokenObj == null) {
      return null;
    }
    return await this.db.user.findUniqueOrThrow({
      where: { id: tokenObj.userId },
    });
  }

  // Token visszavonása
  async revokeToken(token: string) {
    return await this.db.token.delete({ where: { token } });
  }

  // Felhasználó bejelentkezésének validálása
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { email } });
    if (user && (await this.validatePassword(password, user.password))) {
      return user;
    }
    return null;
  }

  async findAdminByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: { email },
    });

    // Ellenőrizzük, hogy a felhasználó admin-e
    if (user && user.role === 'ADMIN') {
      return user;
    }

    return null; // Ha a felhasználó nem admin, visszatérünk null-lal
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
      html, // Használjuk a formázott HTML verziót
    });
    console.log('E-mail sikeresen elküldve.');
  } catch (error) {
    console.error('Hiba történt az e-mail küldésekor:', error);
  }
}

async requestPasswordReset(email: string) {
  const user = await this.db.user.findUnique({ where: { email } });
  if (!user) {
    throw new BadRequestException('Felhasználó nem található');
  }

  const resetToken = await this.generateTokenFor(user);
  const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 óra

  await this.db.token.update({
    where: { userId: user.id, token: resetToken },
    data: {
      token: resetToken,
      resetTokenExpiration,
    },
  });

  const username = await this.db.user.findUnique({
    where: { id: user.id },
    select: { username: true },
  });

  if (username) {
    const resetLink = `http://localhost:5173/uj-jelszo/${resetToken}`;

    const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007bff; text-align: center;">Jelszó visszaállítás</h2>
      <p style="text-align: center;">Kedves <strong>${username.username}</strong>,</p>
      <p style="text-align: center;">Kattints az alábbi gombra a jelszavad visszaállításához:</p>
      <p style="text-align: center;">
        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;">Jelszó visszaállítása</a>
      </p>
      <p style="text-align: center; margin-top: 20px;">Ha a fenti gomb nem működik, másold be az alábbi linket a böngésződ címsorába:</p>
      <p style="text-align: center;">
        <a href="${resetLink}" style="color: #007bff; word-wrap: break-word;">${resetLink}</a>
      </p>
      <p style="text-align: center; margin-top: 30px;">Üdvözlettel,<br><strong>MyBook csapata</strong></p>
    </div>
  `;
  

    await this.sendEmail(user.email, 'Jelszó visszaállítás', emailHtml);
  } else {
    console.error('Felhasználónév nem található.');
  }
}






  async validateResetToken(token: string): Promise<string | null> {
    try {
      const tokenRecord = await this.db.token.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!tokenRecord) {
        console.log("A token nem található az adatbázisban.");
        return null;
      }

      const currentTime = new Date();
      if (tokenRecord.resetTokenExpiration < currentTime) {
        console.log("A token lejárt.");
        return null;
      }

      return tokenRecord.token;

    } catch (error) {
      console.error('Token validálási hiba:', error);
      return null;
    }
  }








  // Jelszó hashelése
  async HashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

}


