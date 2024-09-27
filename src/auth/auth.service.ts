import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { USERS_REPOSITORY, UsersRepository } from '../users/users.interface';

import * as bcrypt from 'bcrypt';
import { SignInDTO } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';

import { ROLES } from '../common/constants/roles.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  /**
   * initialize ADMIN USER
   */
  async onModuleInit() {
    const email = 'admin@admin.com';
    if (!(await this.usersRepository.getOneByEmail(email))) {
      const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
      if (!adminPassword)
        throw new InternalServerErrorException(
          'Variable ADMIN_PASSWORD has to be defined',
        );
      const hash = await bcrypt.hash(adminPassword, 12);
      await this.usersRepository.createOne({
        email,
        name: 'ADMIN',
        hash,
        role: ROLES.ADMIN,
      });
      console.log('ADMIN USER CREATED');
    }
  }

  async signIn(signInData: SignInDTO): Promise<string> {
    const user = await this.usersRepository.getOneByEmail(signInData.email);
    if (!user || !(await bcrypt.compare(signInData.password, user.hash)))
      throw new UnauthorizedException('Email or password incorrect');
    return await this.jwtService.signAsync({
      email: user.email,
      role: user.role,
    });
  }
}
