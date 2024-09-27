import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ROLES } from 'src/common/constants/roles.enum';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  address?: string;
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  password?: string;
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  lastname?: string;
  @IsString()
  @IsOptional()
  profilePicture?: string;
  role?: ROLES = ROLES.USER;
}

export class UpdateUserReqBody {
  @IsString()
  @IsOptional()
  address?: string;
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  password?: string;
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  lastname?: string;
}
