# Deployment Guide

This guide covers deploying LeakJar to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Self-Hosted Deployment](#self-hosted-deployment)
- [Database Setup](#database-setup)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js >= 18.x installed
- ✅ A Supabase project created
- ✅ A ClickHouse database instance
- ✅ All environment variables ready
- ✅ Domain name configured (for production)
- ✅ SSL certificate (for production)

## Environment Variables

### Required Variables

Create a `.env.local` file with the following variables:

```bash
# Application
NEXT_PUBLIC_APP_NAME=LeakJar
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_COMPANY_NAME=SEW Inc.

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ClickHouse
CLICKHOUSE_PROTOCOL=https
CLICKHOUSE_HOST=your-clickhouse-host.com
CLICKHOUSE_PORT=8443
CLICKHOUSE_DB=default
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=your-password
CLICKHOUSE_URL=https://your-clickhouse-host.com:8443
```

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed environment variable documentation.

## Vercel Deployment

Vercel is the recommended platform for deploying Next.js applications.

### Option 1: Deploy via Vercel Dashboard

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env.local`
   - Set for Production, Preview, and Development environments

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts to configure your project
```

### Vercel Configuration

Create a `vercel.json` file in your project root:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_APP_NAME": "LeakJar"
  }
}
```

### Post-Deployment on Vercel

1. **Configure Custom Domain**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Configure HTTPS**
   - Vercel automatically provisions SSL certificates
   - Ensure "Automatically renew SSL" is enabled

3. **Set up Preview Deployments**
   - Every push to a branch creates a preview deployment
   - Share preview URLs with your team

## Docker Deployment

### Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  leakjar:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    depends_on:
      - clickhouse

  clickhouse:
    image: clickhouse/clickhouse-server:latest
    ports:
      - "8123:8123"
      - "9000:9000"
    volumes:
      - clickhouse-data:/var/lib/clickhouse
    environment:
      - CLICKHOUSE_DB=default
      - CLICKHOUSE_USER=default
      - CLICKHOUSE_PASSWORD=your-password
    restart: unless-stopped

volumes:
  clickhouse-data:
```

### Build and Run

```bash
# Build the Docker image
docker build -t leakjar .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Self-Hosted Deployment

### Using PM2 (Process Manager)

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Build the Application**
   ```bash
   npm run build
   ```

3. **Create PM2 Configuration**
   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'leakjar',
       script: 'npm',
       args: 'start',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   };
   ```

4. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Using Nginx as Reverse Proxy

1. **Install Nginx**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/leakjar
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/leakjar /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Database Setup

### Supabase Setup

1. **Create Project**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Create a new project
   - Wait for project to be ready

2. **Configure Authentication**
   - Enable Email authentication
   - Configure OAuth providers (optional)
   - Set up email templates

3. **Create Tables**
   - Use the SQL editor to create necessary tables
   - Set up Row Level Security (RLS) policies
   - Create indexes for performance

4. **Get API Keys**
   - Go to Project Settings → API
   - Copy `URL` and `anon/public` key
   - Copy `service_role` key (keep this secret!)

### ClickHouse Setup

1. **Provision ClickHouse Instance**
   - Use ClickHouse Cloud or self-host
   - Note the connection details

2. **Create Database Schema**
   ```sql
   CREATE DATABASE IF NOT EXISTS leakjar;
   
   CREATE TABLE IF NOT EXISTS leakjar.leaked_data (
       id String,
       email String,
       domain String,
       password String,
       leak_date DateTime,
       source String,
       browser String,
       os String,
       country String,
       created_at DateTime DEFAULT now()
   ) ENGINE = MergeTree()
   ORDER BY (domain, created_at);
   ```

3. **Create Indexes**
   ```sql
   -- Add appropriate indexes for your queries
   ```

## Post-Deployment

### 1. Verify Deployment

```bash
# Check if the application is running
curl https://your-domain.com

# Check API health
curl https://your-domain.com/api/health
```

### 2. Create Admin User

1. Sign up for an account via the UI
2. In Supabase, manually update the user's role to 'admin'
3. Log out and log back in

### 3. Configure Monitoring

- Set up Vercel Analytics (if using Vercel)
- Configure error tracking (e.g., Sentry)
- Set up uptime monitoring

### 4. Security Checklist

- [ ] All environment variables are set correctly
- [ ] HTTPS is enabled
- [ ] Supabase RLS policies are configured
- [ ] API rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Security headers are set

### 5. Performance Optimization

```bash
# Enable Next.js caching
# Configure CDN (Vercel does this automatically)
# Optimize images (Next.js does this automatically)
# Enable compression
```

## Troubleshooting

### Build Fails

**Problem**: Build fails during deployment

**Solutions**:
```bash
# Clear cache and rebuild
npm run clean
rm -rf .next
npm install
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint errors
npm run lint
```

### Database Connection Issues

**Problem**: Can't connect to ClickHouse

**Solutions**:
- Verify CLICKHOUSE_URL is correct
- Check firewall rules allow connection
- Verify username and password
- Check if database exists

### Authentication Not Working

**Problem**: Users can't log in

**Solutions**:
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Verify authentication is enabled in Supabase
- Check browser console for errors

### Environment Variables Not Loading

**Problem**: Environment variables are undefined

**Solutions**:
- Variables must be prefixed with `NEXT_PUBLIC_` to be available in browser
- Restart dev server after changing `.env.local`
- For Vercel, ensure variables are set in dashboard
- Check variable names match exactly (case-sensitive)

### High Memory Usage

**Problem**: Application uses too much memory

**Solutions**:
```bash
# Reduce build workers
export NODE_OPTIONS="--max-old-space-size=4096"

# Use PM2 with max memory limit
pm2 start ecosystem.config.js --max-memory-restart 1G
```

## Support

For deployment issues and questions:

### General Support
- 📧 Email: support@leakjar.com
- 📚 Documentation: https://docs.leakjar.com
- 🐛 Issues: https://github.com/SEWORKSINC/leakjar_nextjs/issues

### Project Leads
For deployment assistance and technical guidance:
- **Ryan Lee**: Slack DM or [ryan.lee@se.works](mailto:ryan.lee@se.works)
- **Min Hong**: [min.hong@se.works](mailto:min.hong@se.works)

---

**Last Updated**: January 2024

