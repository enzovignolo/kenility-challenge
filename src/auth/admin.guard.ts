import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ROLES } from '../common/constants/roles.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request['role'] || request['role'] != ROLES.ADMIN)
      throw new ForbiddenException('Only admin users can access this resource');
    return true;
  }
}
