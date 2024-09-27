import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OnlyIdParam {
  @ApiProperty({ type: String })
  @IsString()
  _id: string;
}
