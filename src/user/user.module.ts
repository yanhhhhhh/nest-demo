import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService], // 服务提供者
  exports: [UserService], // 导出服务, 供其他模块使用
})
export class UserModule {}
