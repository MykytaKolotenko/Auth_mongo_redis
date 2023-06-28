import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ILogin, IReqUser, IToken, IUserDtoRequest } from './auth.dto';
import { User } from 'src/shema/user.shema';
import { AuthService } from './auth.service';
import Hash from 'src/helpers/Hash';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly AuthService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  @HttpCode(201)
  @Post('/register')
  async register(@Body() user: IUserDtoRequest): Promise<User> {
    user.password = await Hash.hashData(user.password);
    const data = await this.AuthService.create(user);

    return data;
  }

  @Post('/login')
  async login(@Body() userData: ILogin): Promise<IToken> {
    const { password, email } = userData;
    if (!password && !email)
      throw new HttpException('Not all data provided', 400);

    const {
      username,
      password: hashedPass,
      id,
    } = await this.AuthService.findByEmail(email);
    if (!username) throw new HttpException('User not found', 404);

    const isCorrectPass = Hash.compareData(password, hashedPass);
    if (!isCorrectPass) throw new HttpException('Password wrong', 400);

    const access_token = await this.jwtService.signAsync({
      email,
      username,
      id,
    });

    await this.AuthService.setToken(id, access_token);

    return {
      access_token,
    };
  }

  @UseGuards(AuthGuard)
  @Get('/current')
  async current(@Req() req: IReqUser) {
    const { email, username } = req.user;
    return { email, username };
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Get('/logout')
  async logout(@Req() req: IReqUser) {
    const { id } = req.user;

    const user = await this.AuthService.setToken(id, null);
    if (!user) throw new HttpException('User not found', 404);

    return;
  }
}
