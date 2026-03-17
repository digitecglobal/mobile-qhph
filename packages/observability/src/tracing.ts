export function initObservability(service: string) {
  return {
    service,
    tracesEnabled: true,
    metricsEnabled: true,
    logsEnabled: true,
    startedAt: new Date().toISOString(),
  };
}
