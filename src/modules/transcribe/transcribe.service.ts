import { Injectable, Logger } from '@nestjs/common';
import { HttpsProxyAgent } from 'https-proxy-agent';
import Groq from 'groq-sdk';
import { ConfigService } from '@nestjs/config';
import {
  TranscribeProcessRequest,
  TranscribeProcessResponse,
} from '@deepvoicerut/contracts/gen/transcribe';
import { RealtimeClient } from '../../infra/rabbitmq/clients/realtime.client';

@Injectable()
export class TranscribeService {
  private readonly logger = new Logger(TranscribeService.name);
  private readonly agent: HttpsProxyAgent<string>;
  private groq: Groq;

  constructor(
    private readonly configService: ConfigService,
    private readonly realtimeClient: RealtimeClient,
  ) {
    const proxyUser = this.configService.getOrThrow<string>('PROXY_USER');
    const proxyPassword =
      this.configService.getOrThrow<string>('PROXY_PASSWORD');
    const proxyUrl = this.configService.getOrThrow<string>('PROXY_URL');
    const apiKey = this.configService.getOrThrow<string>('GROQ_API_KEY');

    const cleanUrl = proxyUrl.replace(/^"|"$/g, '');
    const urlObj = new URL(cleanUrl);

    this.agent = new HttpsProxyAgent(
      `http://${proxyUser}:${proxyPassword}@${urlObj.host}`,
    );

    this.groq = new Groq({
      apiKey: apiKey,
      httpAgent: this.agent,
    });

    this.logger.log('AppService инициализирован');
  }

  public async transcribe(
    dto: TranscribeProcessRequest,
  ): Promise<TranscribeProcessResponse> {
    console.log('start transcription...');
    const response = await this.groq.audio.transcriptions.create({
      model: 'whisper-large-v3-turbo',
      url: dto.downloadUrl,
      response_format: 'verbose_json',
    });
    this.realtimeClient.transcriptionCompleted({
      userId: dto.userId,
      payloadJson: response.text,
    });
    console.log(response);
    return { success: true };
  }
}
