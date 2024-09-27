import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ROLES } from '../../common/constants/roles.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;
  @ApiPropertyOptional()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastname?: string;
  @ApiPropertyOptional()
  @IsEnum(ROLES)
  @IsOptional()
  role?: ROLES = ROLES.USER;
}
