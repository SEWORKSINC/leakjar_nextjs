# Environment Variables Setup

## Overview
This project uses environment variables for configuration. The variables are used throughout the application to configure services and customize the application behavior.

## Setup Instructions

### 1. For Local Development
Copy the example file and update with your actual values:
```bash
cp .env.local.example .env.local
```

### 2. For Vercel Deployment
Add these environment variables in your Vercel project settings:
- Go to Project Settings → Environment Variables
- Add each variable from `.env.local.example`

## Environment Variables Reference

### Application Variables
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_APP_NAME` | Application name displayed in UI | LeakJar | No |
| `NEXT_PUBLIC_APP_URL` | Base URL of the application | https://leakjar.com | No |
| `NEXT_PUBLIC_COMPANY_NAME` | Company name | SEW Inc. | No |

### Supabase Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin) | Yes |

### ClickHouse Variables
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `CLICKHOUSE_PROTOCOL` | Protocol (http/https) | https | No |
| `CLICKHOUSE_HOST` | ClickHouse host | localhost | No |
| `CLICKHOUSE_PORT` | ClickHouse port | 8443 | No |
| `CLICKHOUSE_DB` | Database name | default | No |
| `CLICKHOUSE_USER` | Database user | default | No |
| `CLICKHOUSE_PASSWORD` | Database password | - | Yes |
| `CLICKHOUSE_URL` | Full ClickHouse URL | http://localhost:8123 | No |

## Notes

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Other variables are only available on the server side
- Never commit `.env.local` to version control
- The `.env.local.example` file should be kept up to date with all required variables

## Vercel Deployment
For production deployment on Vercel (project: leakjar):
1. Ensure all environment variables are set in Vercel dashboard
2. Redeploy after updating environment variables
3. Use production values for Supabase and ClickHouse connections
