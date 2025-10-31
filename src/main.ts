import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({ type: VersioningType.URI });
  // 设置全局的前缀
  // app.setGlobalPrefix('api');
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
  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle('接口文档')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3002);
  console.log('server is running at http://localhost:3002');
}
bootstrap();
