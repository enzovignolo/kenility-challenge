import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO, CreateUserReqBody } from './dtos/create-user.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserDTO, UserQueryDTO } from './dtos/get-user.dto';
import { PaginatedResponse } from 'src/common/dto/pagination.dto';
import { UpdateUserReqBody } from './dtos/update-user.dto';
import { OnlyIdParam } from 'src/common/dto/params.dto';

@Controller('users')
export class UsersController {
  constructor(@Inject() private readonly usersService: UsersService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './imgs',
        filename: (req, file, cb) => cb(null, file.originalname),
      }),
    }),
  )
  async createUser(
    @UploadedFile() profilePicture: Express.Multer.File,
    @Body() newUserData: CreateUserReqBody,
  ) {
    const { email, _id } = await this.usersService.createUser(
      newUserData,
      profilePicture.path,
    );
    return { email, _id };
  }
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async getAll(
    @Query() query: UserQueryDTO,
  ): Promise<PaginatedResponse<UserDTO>> {
    const paginationOpts = new UserQueryDTO(query);
    const { users: data, count } =
      await this.usersService.getAll(paginationOpts);
    return {
      data,
      total: count,
      currentPage: paginationOpts.page,
      totalPages: Math.ceil(count / (paginationOpts.limit || count)),
    };
  }
  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './imgs',
        filename: (req, file, cb) => cb(null, file.originalname),
      }),
    }),
  )
  async updateUser(
    @Param() params: OnlyIdParam,
    @Body() data: UpdateUserReqBody,
    @UploadedFile() profilePicture?: Express.Multer.File,
  ) {
    let updatedUserData: UpdateUserReqBody & { profilePicture?: string } = data;
    if (profilePicture) {
      updatedUserData.profilePicture = profilePicture.path;
    }
    const userUpdated = await this.usersService.updateUser(
      params._id,
      updatedUserData,
    );
    return userUpdated;
  }
}
