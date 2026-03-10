import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

export const getRealtimeConfig = (config: ConfigService): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    queue: 'realtime_queue',
    urls: [
      config.getOrThrow<string>(
        'RABBITMQ_URL',
        'amqp://guest:guest@localhsot:5672',
      ),
    ],
    queueOptions: {
      durable: true,
    },
  },
});
