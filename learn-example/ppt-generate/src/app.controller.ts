import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('list')
  getUniversityData() {
    return this.appService.getUniversityData();
  }
}
