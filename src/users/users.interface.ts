import { CreateUserDTO } from './dtos/create-user.dto';
import { UserDTO, UserQueryDTO } from './dtos/get-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

export const USERS_REPOSITORY = 'UsersRepository';

export interface UsersRepository {
  createOne(createUserDto: CreateUserDTO): Promise<Pick<User, '_id' | 'email'>>;
  getAllandCount(
    paginationParms?: UserQueryDTO,
  ): Promise<{ users: UserDTO[]; count: number }>;
  updateOne(id: string, updateUserDto: UpdateUserDTO): Promise<UserDTO>;
  getOneByEmail(email: string): Promise<User>;
}
