import { BaseClient } from './base.client';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EmitToUserRequest } from '@deepvoicerut/contracts/gen/realtime';

@Injectable()
export class RealtimeClient extends BaseClient {
  constructor(@Inject('REALTIME_CLIENT') client: ClientProxy) {
    super(client, 'REALTIME_CLIENT');
  }

  public transcriptionCompleted(dto: EmitToUserRequest) {
    this.emitEvent('transcription.completed', dto);
  }
}
