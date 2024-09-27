import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserReqBody } from './dtos/create-user.dto';
import { USERS_REPOSITORY, UsersRepository } from './users.interface';
import { User } from './entities/user.entity';
import { UserQueryDTO } from './dtos/get-user.dto';
import { UpdateUserReqBody } from './dtos/update-user.dto';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}
  async createUser(
    newUserData: CreateUserReqBody,
    profilePicturePath: string,
  ): Promise<Pick<User, '_id' | 'email'>> {
    //Hash user password
    const hash = await bcrypt.hash(newUserData.password, 12);
    //save user data
    const newUser = await this.usersRepository.createOne({
      ...newUserData,
      hash,
      profilePicture: profilePicturePath,
    });
    return newUser;
  }
  async getAll(paginationParms?: UserQueryDTO) {
    return this.usersRepository.getAllandCount(paginationParms);
  }

  async updateUser(
    id: string,
    updatedUserData: UpdateUserReqBody & { profilePicture?: string },
  ) {
    return this.usersRepository.updateOne(id, updatedUserData);
  }
}
