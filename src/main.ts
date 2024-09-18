import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({ type: VersioningType.URI });
  // 静态文件
  app.useStaticAssets('public', {
    prefix: '/static',
  });
  // 全局中间件
  app.use((req, res, next) => {
    console.log('before', req.url);
    next();
    console.log('after', req.url);
  });
  await app.listen(3000);
}
bootstrap();
