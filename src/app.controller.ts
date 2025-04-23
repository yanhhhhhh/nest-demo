import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  SetMetadata,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { AaaFilter } from './aaa.filter';
import { TestGuardGuard } from './test-guard/test-guard.guard';
import { AaaFunctionDecorator } from './custom-decorator/aaa.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(UserService) // 依赖注入exports的服务
  private userService: UserService;

  @Get()
  // @UseFilters(AaaFilter)
  // @SetMetadata('aaa', 'bbb')
  @AaaFunctionDecorator('admin')
  @UseGuards(TestGuardGuard)
  getHello(): string {
    // throw new HttpException('error', HttpStatus.BAD_REQUEST);
    return this.appService.getHello() + this.userService.getHello();
  }
}
