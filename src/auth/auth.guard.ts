import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH_CONSTANTS } from '../common/constants/auth.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: AUTH_CONSTANTS.JWT_SECRET,
      });

      request['email'] = payload.email;
      request['role'] = payload.role;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
