import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ILogin,
  IMessage,
  IReqUser,
  IToken,
  IUserDtoRequest,
} from './auth.dto';
import Hash from 'src/helpers/Hash';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ErrorWrapper } from 'src/interceptors/errorWrapper.interceptor';

@UseInterceptors(ErrorWrapper)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/register')
  @HttpCode(201)
  async register(@Body() user: IUserDtoRequest): Promise<IMessage> {
    user.password = await Hash.hashData(user.password);
    await this.authService.create(user);

    return { message: 'registration successful' };
  }

  @Post('/login')
  async login(@Body() userData: ILogin): Promise<IToken> {
    const { password, email } = userData;
    if (!password || !email)
      throw new HttpException('Not all data provided', 400);

    const {
      username,
      password: hashedPass,
      id,
    } = await this.authService.findByEmail(email);
    if (!username) throw new HttpException('User not found', 404);

    const isCorrectPass = await Hash.compareData(password, hashedPass);
    if (!isCorrectPass) throw new HttpException('Password wrong', 400);

    const access_token = await this.jwtService.signAsync({
      email,
      username,
      id,
    });
    await this.authService.setToken(id, access_token);

    return {
      access_token,
    };
  }

  @Get('/current')
  @UseGuards(AuthGuard)
  async current(@Req() req: IReqUser): Promise<Partial<IUserDtoRequest>> {
    const { email, username } = req.user;
    return { email, username };
  }

  @Get('/logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: IReqUser): Promise<IMessage> {
    const { id } = req.user;

    const user = await this.authService.setToken(id, null);
    if (!user) throw new HttpException('User not found', 404);

    return { message: 'Successfull' };
  }
}
