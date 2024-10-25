import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwtService: JwtService, // JWT Service hozzáadása
  ) {}

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
}


