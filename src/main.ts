import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PaginatedResponse } from './common/dto/pagination.dto';
import { UserDTO } from './users/dtos/get-user.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //register swagger module to app
  const config = new DocumentBuilder()
    .setTitle('Kenility Challenge API')
    .setDescription('Users API made for Kenility code challenge')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [PaginatedResponse, UserDTO],
  });
  SwaggerModule.setup('docs', app, document);
  //add validation pipeline
  app.useGlobalPipes(new ValidationPipe());
  //
  await app.listen(process.env.PORT);
  console.log(`[OK] API RUNNING ON PORT ${process.env.PORT}`);
  process.on('unhandledRejection', (error, promise) => {
    console.log('Unhandled rejection at ', promise, `reason: ${error}`);
  });
}
bootstrap();
