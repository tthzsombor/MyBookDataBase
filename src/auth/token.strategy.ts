import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-http-bearer';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: string) {
    const user: any = await this.authService.findUserByToken(token);
    if (user == null) {
      throw new UnauthorizedException();
    }

    // Ha a tokenhez van lejárati idő, azt is itt tudjuk ellenőrizni
    // Pl. "validUntil" oszlop segítségével
    return user;
  }
}
