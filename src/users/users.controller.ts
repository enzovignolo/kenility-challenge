import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
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
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(@Inject() private readonly usersService: UsersService) {}
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        _id: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', enum: [401] },
        message: { type: 'string', enum: ['Unauthorized'] },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        status: { type: 'number', enum: [403] },
        error: { type: 'string', enum: ['Forbidden'] },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create user with profile picture',
    schema: {
      type: 'object',
      properties: {
        address: { type: 'string', nullable: true },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        name: { type: 'string' },
        lastname: { type: 'string', nullable: true },
        role: { type: 'string', enum: ['USER', 'ADMIN'] },
        profilePicture: { type: 'string', format: 'binary', nullable: true }, // Archivo de imagen
      },
    },
  })
  @Post()
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './imgs',
        filename: (req, file, cb) => cb(null, file.originalname),
      }),
    }),
  )
  @UseGuards(AuthGuard, AdminGuard)
  async createUser(
    @UploadedFile() profilePicture: Express.Multer.File,
    @Body() newUserData: CreateUserReqBody,
  ) {
    const { email, _id } = await this.usersService.createUser(
      newUserData,
      profilePicture?.path,
    );
    return { email, _id };
  }
  @ApiOkResponse({
    description: 'List of users',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(UserDTO) },
            },
          },
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', enum: [401] },
        message: { type: 'string', enum: ['Unauthorized'] },
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
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
  @ApiOkResponse({
    type: UserDTO,
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', enum: [401] },
        message: { type: 'string', enum: ['Unauthorized'] },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        status: { type: 'number', enum: [403] },
        error: { type: 'string', enum: ['Forbidden'] },
      },
    },
  })
  @UseGuards(AuthGuard, AdminGuard)
  @Put('/:_id')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './imgs',
        filename: (req, file, cb) => cb(null, file.originalname),
      }),
    }),
  )
  @ApiBody({
    description: 'Create user with profile picture',
    schema: {
      type: 'object',
      properties: {
        address: { type: 'string', nullable: true },
        email: { type: 'string', format: 'email', nullable: true },
        password: { type: 'string', nullable: true },
        name: { type: 'string' },
        lastname: { type: 'string', nullable: true },
        role: { type: 'string', enum: ['USER', 'ADMIN'] },
        profilePicture: { type: 'string', format: 'binary', nullable: true }, // Archivo de imagen
      },
    },
  })
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
    if (!userUpdated)
      throw new NotFoundException(`User with _id ${params._id}, was not found`);
    return userUpdated;
  }
}
