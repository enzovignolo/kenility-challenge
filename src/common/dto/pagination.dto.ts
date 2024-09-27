import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  @ApiProperty()
  data: T[];
  @ApiProperty()
  total: number;
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  totalPages: number;
}
