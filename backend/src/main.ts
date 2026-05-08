import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5000',
      'https://techmindsverse-os.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

   app.setGlobalPrefix('api/v1');


  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('TechMindsVerse API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 5000);

  console.log(`🚀 Server running on port ${process.env.PORT ?? 5000}`);
  console.log(`📘 Swagger: http://localhost:${process.env.PORT ?? 5000}/api/docs`);
}

bootstrap();