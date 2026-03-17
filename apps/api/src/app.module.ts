import { Module } from '@nestjs/common';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { EventsModule } from './events/events.module';
import { HealthController } from './health/health.controller';
import { ModerationModule } from './moderation/moderation.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OnboardingModule,
    UsersModule,
    EventsModule,
    DiscoveryModule,
    BookmarksModule,
    ReportsModule,
    AnalyticsModule,
    ModerationModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
