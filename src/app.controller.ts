import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(UserService) // 依赖注入exports的服务
  private userService: UserService;

  @Get()
  getHello(): string {
    return this.appService.getHello() + this.userService.getHello();
  }
}
