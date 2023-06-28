import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/shema/user.shema';
import { IUserDtoRequest } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createAuthDto: IUserDtoRequest) {
    const createUser = new this.userModel(createAuthDto);
    return await createUser.save();
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);

    return user;
  }

  async setToken(id: string, token: string | null) {
    return await this.userModel.findByIdAndUpdate(id, { token });
  }
}
