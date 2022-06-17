import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { TransformInterceptor } from './interceptor/response.interceptor';
// import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// import { Logger } from 'nestjs-pino';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  // app.useLogger(app.get(Logger));
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.enableCors({ origin: 'http://localhost:4000' });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3000);

  app.useGlobalPipes(new ValidationPipe());
}
bootstrap();
