import { Controller } from '@nestjs/common';
import { TranscribeService } from './transcribe.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  TranscribeProcessRequest,
  TranscribeServiceController,
} from '@deepvoicerut/contracts/gen/transcribe';
import { TranscribeServiceControllerMethods } from '@deepvoicerut/contracts/dist/transcribe';

@Controller('transcribe')
@TranscribeServiceControllerMethods()
export class TranscribeController implements TranscribeServiceController {
  constructor(private readonly transcribeService: TranscribeService) {}

  @EventPattern('transcribe.process')
  public transcribeProcess(dto: TranscribeProcessRequest) {
    return this.transcribeService.transcribe(dto);
  }
}
