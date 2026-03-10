import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export abstract class BaseClient implements OnModuleInit, OnModuleDestroy {
  protected readonly logger: Logger;

  constructor(
    protected readonly client: ClientProxy,
    protected readonly serviceName: string,
  ) {
    this.logger = new Logger(`${serviceName.toUpperCase()}_CLIENT`);
  }

  async onModuleInit() {
    await this.client.connect();
    this.logger.log(
      `✅ Connected to ${this.serviceName.toUpperCase()}_SERVICE`,
    );
  }

  async onModuleDestroy() {
    await this.client.close();
    this.logger.log(
      `✅ Disconnected from ${this.serviceName.toUpperCase()}_SERVICE`,
    );
  }

  protected async sendRequest(pattern: string, data?: any): Promise<unknown> {
    try {
      return await firstValueFrom(this.client.send(pattern, data || {}));
    } catch (error) {
      this.logger.error(
        `Error calling ${this.serviceName} service: ${pattern}`,
        error,
      );
      throw error;
    }
  }

  protected emitEvent(pattern: string, data?: any): void {
    this.client.emit(pattern, data || {});
    this.logger.log(`Event emitted: ${pattern}`);
  }
}
