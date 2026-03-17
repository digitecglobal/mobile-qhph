import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createLogger } from '@qhph/observability';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = createLogger('api');

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.info('prisma connected');
    } catch (error) {
      this.logger.warn('prisma connection skipped', { error: String(error) });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
