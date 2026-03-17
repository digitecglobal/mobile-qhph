import { randomUUID } from 'node:crypto';
import { createLogger, initObservability } from '@qhph/observability';
import { EventStatus, PrismaClient } from '@prisma/client';

const logger = createLogger('worker');
const prisma = new PrismaClient();

const POLL_INTERVAL_MS = Number(process.env.WORKER_POLL_MS || 5 * 60 * 1000);

type ReminderWindow = {
  action: 'event_reminder_24h' | 'event_reminder_2h';
  minHours: number;
  maxHours: number;
};

const WINDOWS: ReminderWindow[] = [
  { action: 'event_reminder_24h', minHours: 23.5, maxHours: 24.5 },
  { action: 'event_reminder_2h', minHours: 1.5, maxHours: 2.5 },
];

async function runReminderScan() {
  const now = new Date();

  for (const window of WINDOWS) {
    const start = new Date(now.getTime() + window.minHours * 60 * 60 * 1000);
    const end = new Date(now.getTime() + window.maxHours * 60 * 60 * 1000);

    const bookmarks = await prisma.eventBookmark.findMany({
      where: {
        event: {
          status: EventStatus.published,
          startAt: {
            gte: start,
            lte: end,
          },
        },
      },
      select: {
        userId: true,
        eventId: true,
        event: {
          select: {
            title: true,
            startAt: true,
            timezone: true,
          },
        },
      },
      take: 1000,
    });

    let enqueued = 0;

    for (const item of bookmarks) {
      const existing = await prisma.auditLog.findFirst({
        where: {
          actorId: item.userId,
          action: window.action,
          entity: 'event_reminder',
          entityId: item.eventId,
        },
        select: { id: true },
      });

      if (existing) {
        continue;
      }

      await prisma.auditLog.create({
        data: {
          id: randomUUID(),
          actorId: item.userId,
          action: window.action,
          entity: 'event_reminder',
          entityId: item.eventId,
          metadata: {
            eventTitle: item.event.title,
            eventStartAt: item.event.startAt.toISOString(),
            timezone: item.event.timezone,
          },
        },
      });

      enqueued += 1;
    }

    logger.info('reminder scan window finished', {
      action: window.action,
      matched: bookmarks.length,
      enqueued,
      from: start.toISOString(),
      to: end.toISOString(),
    });
  }
}

async function bootstrapWorker() {
  const obs = initObservability('worker');
  logger.info('observability initialized', obs);

  process.env.DATABASE_URL =
    process.env.DATABASE_URL || 'postgresql://qhph:qhph@localhost:5432/qhph?schema=public';

  try {
    await prisma.$connect();
    logger.info('worker connected to database');
  } catch (error) {
    logger.warn('worker database connection failed; scanner will keep retrying', {
      error: String(error),
    });
  }

  const run = async () => {
    try {
      await runReminderScan();
    } catch (error) {
      logger.warn('reminder scan failed', { error: String(error) });
    }
  };

  await run();
  setInterval(run, POLL_INTERVAL_MS);

  logger.info('worker reminder scanner running', {
    pollIntervalMs: POLL_INTERVAL_MS,
  });
}

bootstrapWorker().catch((error) => {
  logger.error('worker bootstrap error', { error: String(error) });
  process.exit(1);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
