import { Global, Module } from '@nestjs/common';
import { RealtimeClient } from './clients/realtime.client';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRealtimeConfig } from './configs/realtime.config';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'REALTIME_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: getRealtimeConfig,
      },
    ]),
  ],
  providers: [RealtimeClient],
  exports: [RealtimeClient],
})
export class RabbitmqModule {}
