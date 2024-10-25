import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Nincs hozzáférése ehhez a területhez.');
    }

    return true;
  }
}
