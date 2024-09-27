import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ROLES } from '../../common/constants/roles.enum';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  hash: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsString()
  @IsNotEmpty()
  profilePicture: string;

  role?: ROLES = ROLES.USER;
}

export class CreateUserReqBody {
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEnum(ROLES)
  @IsOptional()
  role?: ROLES = ROLES.USER;
}
