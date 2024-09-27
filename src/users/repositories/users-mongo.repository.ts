import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../users.interface';
import { UserModel } from '../schemas/users.schema';

import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dtos/create-user.dto';
import { UserDTO, UserQueryDTO } from '../dtos/get-user.dto';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import { Types } from 'mongoose';
@Injectable()
export class UserMongoRepository implements UsersRepository {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel) {}
  async createOne(data: CreateUserDTO): Promise<Pick<User, '_id' | 'email'>> {
    try {
      const { _id, email } = await this.userModel.create(data);
      return { _id, email };
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
  async updateOne(id: string, updateUserDto: UpdateUserDTO): Promise<UserDTO> {
    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { ...updateUserDto, updatedAt: new Date(Date.now()) } },
        { new: true },
      )
      .select('-hash')
      .lean<UserDTO>();
    return updatedUser;
  }
}
