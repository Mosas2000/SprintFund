# SSL/HTTPS Configuration

This guide covers SSL certificate setup and HTTPS configuration for SprintFund deployments.

## Managed SSL (Recommended)

### Vercel

Vercel automatically provisions and renews SSL certificates for all domains. No configuration required.

### Netlify

Netlify automatically provisions Let's Encrypt certificates for all domains. Enable in:

1. Site settings > Domain management > HTTPS
2. Verify DNS is configured correctly
3. Click "Provision certificate"

## Self-Hosted SSL Setup

### Using Certbot (Let's Encrypt)

Install Certbot:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

Obtain certificate:

```bash
sudo certbot --nginx -d sprintfund.app -d www.sprintfund.app
```

Auto-renewal is configured automatically. Test with:

```bash
sudo certbot renew --dry-run
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name sprintfund.app www.sprintfund.app;

    ssl_certificate /etc/letsencrypt/live/sprintfund.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sprintfund.app/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=63072000" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name sprintfund.app www.sprintfund.app;
    return 301 https://$server_name$request_uri;
}
```

### Using Caddy (Automatic HTTPS)

Caddy automatically obtains and renews certificates:

```caddyfile
sprintfund.app {
    reverse_proxy localhost:3000
}
```

## Docker with Traefik

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@sprintfund.app"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./letsencrypt:/letsencrypt

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`sprintfund.app`)"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
```

## Security Headers

The application includes security headers configured in `next.config.ts` and `vercel.json`:

- Strict-Transport-Security (HSTS)
- X-Content-Type-Options
- X-Frame-Options
- Content-Security-Policy
- Referrer-Policy

## Testing SSL Configuration

Use SSL Labs to test your configuration:

```
https://www.ssllabs.com/ssltest/analyze.html?d=sprintfund.app
```
