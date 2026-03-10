import { Module } from '@nestjs/common';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
})
export class InfraModule {}
