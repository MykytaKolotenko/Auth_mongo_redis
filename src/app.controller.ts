import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { ErrorWrapper } from './interceptors/errorWrapper.interceptor';
@UseInterceptors(ErrorWrapper)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard)
  @Get('/')
  async films() {
    return await this.appService.getAllfilms();
  }
}
