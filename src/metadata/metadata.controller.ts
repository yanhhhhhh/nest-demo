import { MetadataService } from './metadata.service';
import {
  Controller,
  Get,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import 'reflect-metadata';
import { RolesGuard } from './roles.guard';
import { RolesInterceptor } from './roles.interceptor';

@SetMetadata('roles', ['user']) //// 类级别
@Controller('/metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}
  @Get()
  @UseGuards(RolesGuard) // 使用自定义守卫
  @UseInterceptors(RolesInterceptor) // 使用自定义拦截器
  @SetMetadata('roles', ['admin']) // 方法级别
  getOne() {
    this.metadataService.getdata();
    //读取构造函数参数类型,输出结果: [ [Class: MetadataService] ]
    console.log(Reflect.getMetadata('design:paramtypes', MetadataController));
    return 'metadata';
  }
}
