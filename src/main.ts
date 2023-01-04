import { HttpExceptionFilter } from './common/filters/httpException.filter';
import { ResponseTransformerInterceptor } from './common/transform/response.transform';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new ResponseTransformerInterceptor());

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
