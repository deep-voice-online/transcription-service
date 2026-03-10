import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // Разрешить все источники (можно указать конкретные домены)
    credentials: true, // Разрешить отправку cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  const config = app.get(ConfigService);

  const port = config.getOrThrow<number>('HTTP_PORT');

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      queue: 'transcribe_queue',
      urls: [
        config.getOrThrow<string>(
          'RABBITMQ_URL',
          'amqp://guest:guest@localhost:5672',
        ),
      ],
    },
  });

  await app.startAllMicroservices();
  console.log('started all microservices...');
}

bootstrap();
