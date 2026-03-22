# Monitoring and Observability

This guide covers monitoring setup for SprintFund frontend deployments.

## Health Endpoints

The application exposes the following health endpoints:

| Endpoint | Purpose |
|----------|---------|
| `/api/health` | Primary health check |
| `/healthz` | Kubernetes liveness probe |
| `/ready` | Kubernetes readiness probe |

## Vercel Analytics

Enable Vercel Analytics in your project:

1. Go to Project Settings > Analytics
2. Enable Web Analytics
3. Optionally enable Speed Insights

No code changes required - analytics are injected automatically.

## Custom Monitoring Integration

### Datadog

Add to your environment variables:

```bash
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=<your-token>
NEXT_PUBLIC_DATADOG_APPLICATION_ID=<your-app-id>
```

### Sentry

Add to your environment variables:

```bash
SENTRY_DSN=<your-dsn>
NEXT_PUBLIC_SENTRY_DSN=<your-dsn>
```

## Uptime Monitoring

Configure external uptime monitoring to check:

- Production: `https://sprintfund.app/api/health`
- Staging: `https://staging.sprintfund.app/api/health`

Recommended check interval: 60 seconds

## Alerting

### Vercel

Configure deployment notifications in Project Settings > Integrations:

- Slack
- Email
- Webhooks

### Custom Alerts

Use the health endpoint response to trigger alerts:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600
}
```

Alert when:
- Status is not "healthy"
- Response time exceeds 5 seconds
- Endpoint returns non-200 status

## Logging

### Vercel

Logs are available in the Vercel dashboard under Deployments > Logs.

### Docker

View container logs:

```bash
docker logs -f sprintfund-frontend
```

### Structured Logging

The application uses structured JSON logging in production for easier parsing.
