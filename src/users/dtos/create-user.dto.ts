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
  @IsOptional()
  address?: string;
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
  @IsOptional()
  lastname?: string;
  @IsString()
  @IsOptional()
  profilePicture?: string;

  role?: ROLES = ROLES.USER;
}

export class CreateUserReqBody {
  @IsString()
  @IsOptional()
  address?: string;
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
  @IsOptional()
  lastname?: string;
  @IsEnum(ROLES)
  @IsOptional()
  role?: ROLES = ROLES.USER;
}
