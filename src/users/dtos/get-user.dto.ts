import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Types } from 'mongoose';

export class UserDTO {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;
  @ApiProperty()
  name: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  profilePicture?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class UserQueryDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit: number;
  constructor(opts?: { page: number; limit: number }) {
    if (opts) {
      this.page = opts.page || 1;
      this.limit = opts.limit;
    }
  }
}
