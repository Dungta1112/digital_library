import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Digital Library Forum Backend API')
    .setDescription('REST API for digital library, academic forum, study groups, moderation, administration, statistics, and system configuration.')
    .setVersion('0.1.0')
    .addServer('http://localhost:3000')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Users')
    .addTag('RolePermission')
    .addTag('LibraryDocuments')
    .addTag('LecturerDocuments')
    .addTag('Forum')
    .addTag('StudyGroups')
    .addTag('ContentManagement')
    .addTag('AdminManagement')
    .addTag('Statistics')
    .addTag('SystemConfig')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const allowedHosts = process.env.ALLOWED_HOSTS || '*';
  app.enableCors({
    origin: allowedHosts === '*' ? '*' : allowedHosts.split(','),
    credentials: true,
  });

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
}

void bootstrap();
