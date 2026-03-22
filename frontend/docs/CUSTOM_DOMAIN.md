# Custom Domain Configuration

This guide covers setting up custom domains for SprintFund frontend deployments.

## Vercel

### Adding a Custom Domain

1. Go to your project settings in Vercel
2. Navigate to Domains
3. Add your domain (e.g., `sprintfund.app`)
4. Configure DNS records as instructed

### DNS Configuration

Add the following records to your DNS provider:

| Type  | Name | Value                    |
|-------|------|--------------------------|
| A     | @    | 76.76.21.21             |
| CNAME | www  | cname.vercel-dns.com    |

### Subdomain Setup

For staging environments:

| Type  | Name    | Value                    |
|-------|---------|--------------------------|
| CNAME | staging | cname.vercel-dns.com    |

## Netlify

### Adding a Custom Domain

1. Go to Site settings > Domain management
2. Add custom domain
3. Configure DNS records

### DNS Configuration

| Type  | Name | Value                           |
|-------|------|---------------------------------|
| A     | @    | 75.2.60.5                      |
| CNAME | www  | your-site.netlify.app          |

## Docker / Self-Hosted

### Using Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name sprintfund.app www.sprintfund.app;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Using Caddy

```caddyfile
sprintfund.app {
    reverse_proxy localhost:3000
}
```

## DNS Propagation

DNS changes can take up to 48 hours to propagate globally. You can check propagation status using:

```bash
dig +short sprintfund.app
```

## Wildcard Domains

For multi-tenant setups, configure wildcard DNS:

| Type  | Name | Value                    |
|-------|------|--------------------------|
| CNAME | *    | cname.vercel-dns.com    |
