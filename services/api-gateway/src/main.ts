import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  );

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  });

  // Setup Swagger OpenAPI 3.1 Documentation
  const config = new DocumentBuilder()
    .setTitle('BHN Core - Enterprise Microservices ERP API')
    .setDescription(
      'Hệ thống lõi tích hợp dữ liệu & điều hành đa dịch vụ (CRM, Booking, POS, HR, AI Copilot) - Tiêu chuẩn 2026'
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT_GATEWAY || 8000);
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 BHN Core API Gateway running at: http://localhost:${port}`);
  console.log(`📚 OpenAPI / Swagger Docs at: http://localhost:${port}/docs`);
}

bootstrap();
