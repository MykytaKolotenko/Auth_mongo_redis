import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader = req.headers.authorization;

      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || token)
        new UnauthorizedException({ message: 'No token data' });

      const user = this.jwtService.decode(token);

      if (typeof user === 'string' || !user)
        throw new UnauthorizedException({
          message: 'Incorrect token',
        });

      const isUser = await this.authService.findById(user.id);
      if (isUser && isUser.token !== token)
        throw new UnauthorizedException({
          message: 'User not found',
        });

      req.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException({ message: error.message });
    }
  }
}
