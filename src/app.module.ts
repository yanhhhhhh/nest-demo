import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LogMiddleware } from './log.middleware';
import { ProductModule } from './product/product.module';
import { AaaModule } from './aaa/aaa.module';
import { BbbModule } from './bbb/bbb.module';
import { MetadataModule } from './metadata/metadata.module';

@Module({
  imports: [UserModule, ProductModule, AaaModule, BbbModule, MetadataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('product*'); // 应用中间件
  }
}
