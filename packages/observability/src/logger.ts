type LogLevel = 'info' | 'warn' | 'error';

type LogPayload = {
  service: string;
  level: LogLevel;
  message: string;
  traceId?: string;
  timestamp: string;
  context?: Record<string, unknown>;
};

function emit(payload: LogPayload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

export function createLogger(service: string) {
  return {
    info(message: string, context?: Record<string, unknown>, traceId?: string) {
      emit({
        service,
        level: 'info',
        message,
        timestamp: new Date().toISOString(),
        traceId,
        context,
      });
    },
    warn(message: string, context?: Record<string, unknown>, traceId?: string) {
      emit({
        service,
        level: 'warn',
        message,
        timestamp: new Date().toISOString(),
        traceId,
        context,
      });
    },
    error(message: string, context?: Record<string, unknown>, traceId?: string) {
      emit({
        service,
        level: 'error',
        message,
        timestamp: new Date().toISOString(),
        traceId,
        context,
      });
    },
  };
}
