import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { TransformInterceptor } from './interceptor/response.interceptor';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { Logger } from 'nestjs-pino';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    // cors: true,
  });
  //   app.setGlobalPrefix('api');

  app.useStaticAssets(join(__dirname, '../..', 'files'), {
    prefix: '/files',
  });

  app.enableCors({
    credentials: true,
    // origin: true,
    origin: ['http://localhost:4000'],
    // origin: '*',
    // allowedHeaders: 'authorization, content-type, access-control-allow-origin',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // preflightContinue: false,
    // optionsSuccessStatus: 204,
    // allowedHeaders: '*',
    // allowedHeaders:
    //   'authorization, Content-Type, Accept, access-control-allow-origin access-control-allow-methods',
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  app.useGlobalPipes(new ValidationPipe());
}
bootstrap();
