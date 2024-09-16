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
  await app.listen(3000);
}
bootstrap();
