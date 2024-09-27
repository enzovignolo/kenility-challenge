import { Types } from 'mongoose';
import { ROLES } from '../../common/constants/roles.enum';

export class User {
  _id: Types.ObjectId;
  email: string;
  hash: string;
  lastname: string;
  name: string;
  profilePicture: string;
  role: ROLES;
  createdAt: Date;
  updatedAt: Date;
}
