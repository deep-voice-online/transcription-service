import { Controller } from '@nestjs/common';
import { TranscribeService } from './transcribe.service';
import { EventPattern } from '@nestjs/microservices';
import { TranscribeProcessRequest } from '@deepvoicerut/contracts/gen/transcribe';

@Controller('transcribe')
export class TranscribeController {
  constructor(private readonly transcribeService: TranscribeService) {}

  @EventPattern('transcribe.process')
  public transcribeProcess(dto: TranscribeProcessRequest) {
    return this.transcribeService.transcribe(dto);
  }
}
