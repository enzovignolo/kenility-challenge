import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../users.interface';
import { UserModel } from '../schemas/users.schema';

import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UserDTO, UserQueryDTO } from '../dtos/get-user.dto';
@Injectable()
export class UserMongoRepository implements UsersRepository {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel) {}
  async createOne(data: CreateUserDTO): Promise<Pick<User, 'id' | 'email'>> {
    try {
      const { _id: id, email } = await this.userModel.create(data);
      return { id, email };
    } catch (err) {
      if (err.code) {
        if (err.code === 11000) throw new BadRequestException(err.errmsg);
      }
    }
  }
  async getOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }
  async getAllandCount(
    paginationParams?: UserQueryDTO,
  ): Promise<{ users: UserDTO[]; count: number }> {
    const [users, count] = await Promise.all([
      this.userModel
        .find()
        .limit(paginationParams.limit)
        .skip(paginationParams.limit * (paginationParams.page - 1))
        .select('-hash')
        .lean<UserDTO[]>(),
      this.userModel.countDocuments({}),
    ]);
    return { users: users, count };
  }
}
