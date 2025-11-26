import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },

      exceptionFactory: (errors) => {
        // Lấy error đầu tiên
        const firstError = errors[0];
        const constraints = firstError.constraints;

        // Lấy message đầu tiên trong constraints
        const firstMessage = constraints
          ? Object.values(constraints)[0]
          : 'Validation error';

        return new BadRequestException(firstMessage);
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
