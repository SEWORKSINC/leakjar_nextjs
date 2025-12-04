# LeakJar Database Schema Documentation

Generated on: December 1, 2025
Database: PostgreSQL (Supabase)
Project Ref: `vtemdbatuetcrbgylnob`

---

## 📋 Table of Contents

- [Core User Management](#core-user-management)
- [Organization & Team Management](#organization--team-management)
- [API & Authentication](#api--authentication)
- [Domain & Monitoring](#domain--monitoring)
- [Billing & Subscription](#billing--subscription)
- [Data Processing & Exports](#data-processing--exports)
- [Audit & Logging](#audit--logging)
- [Notifications & Alerts](#notifications--alerts)
- [System Administration](#system-administration)
- [Support & Helpdesk](#support--helpdesk)

---

## 👥 Core User Management

### `users`
Core user authentication and profile information.

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  name text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

**Fields:**
- `id`: Unique user identifier
- `email`: User email address (unique)
- `name`: Display name
- `created_at`: Account creation timestamp
- `updated_at`: Last modification timestamp

### `user_profiles`
Extended user preferences and settings.

```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  display_name text,
  timezone text NOT NULL DEFAULT 'UTC',
  language text NOT NULL DEFAULT 'en',
  notify_email boolean NOT NULL DEFAULT true,
  notify_breach boolean NOT NULL DEFAULT true,
  notify_product boolean NOT NULL DEFAULT false,
  two_factor_enabled boolean NOT NULL DEFAULT false,
  dark_mode boolean NOT NULL DEFAULT false,
  role text DEFAULT 'USER',
  current_organization_id uuid REFERENCES organizations(id),
  personal_organization_id uuid REFERENCES organizations(id),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

**Fields:**
- `role`: User role (USER, ADMIN, etc.)
- `notify_*`: Notification preferences
- `current_organization_id`: Currently selected organization
- `personal_organization_id`: Personal organization reference

### `mfa_devices`
Multi-factor authentication devices.

```sql
CREATE TABLE mfa_devices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  device_name text NOT NULL,
  device_type text NOT NULL,
  secret text NOT NULL,
  backup_codes text[],
  is_primary boolean NOT NULL DEFAULT false,
  verified_at timestamp with time zone,
  last_used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## 🏢 Organization & Team Management

### `organizations`
Company/Organization accounts with subscription plans.

```sql
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  logo_url text,
  description text,
  website text,
  settings jsonb DEFAULT '{}',
  subscription_plan character varying DEFAULT 'free',
  subscription_status character varying DEFAULT 'active',
  billing_email character varying,
  stripe_customer_id character varying,
  stripe_subscription_id character varying,
  max_members integer DEFAULT 5,
  max_domains integer DEFAULT 10,
  max_monthly_searches integer DEFAULT 1000,
  created_by uuid REFERENCES users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);
```

**Fields:**
- `slug`: URL-friendly organization identifier
- `subscription_plan`: Current plan (free, pro, enterprise)
- `max_*`: Plan-based limits
- `stripe_*`: Billing integration

### `organization_members`
User membership in organizations.

```sql
CREATE TABLE organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  user_id uuid REFERENCES users(id),
  role character varying DEFAULT 'member',
  permissions jsonb DEFAULT '{}',
  status character varying DEFAULT 'active',
  invited_by uuid REFERENCES users(id),
  invited_at timestamp with time zone,
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);
```

**Roles:**
- `owner`: Full control
- `admin`: Administrative access
- `member`: Standard access

### `organization_invitations`
Pending invitations to join organizations.

```sql
CREATE TABLE organization_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  email character varying NOT NULL,
  role character varying DEFAULT 'member',
  invitation_token character varying NOT NULL,
  status character varying DEFAULT 'pending',
  invited_by uuid REFERENCES users(id),
  invited_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  accepted_at timestamp with time zone,
  expires_at timestamp with time zone DEFAULT timezone('utc'::text, (now() + '7 days'::interval))
);
```

### `organization_activity_logs`
Audit trail for organization activities.

```sql
CREATE TABLE organization_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  user_id uuid REFERENCES users(id),
  action character varying NOT NULL,
  resource_type character varying,
  resource_id uuid,
  details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);
```

### `teams`
Team structure within organizations.

```sql
CREATE TABLE teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  owner_id uuid NOT NULL REFERENCES users(id),
  subscription_id uuid REFERENCES subscriptions(id),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `team_members`
Membership within teams.

```sql
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid NOT NULL REFERENCES teams(id),
  user_id uuid NOT NULL REFERENCES users(id),
  role text NOT NULL,
  permissions jsonb,
  joined_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## 🔐 API & Authentication

### `api_keys`
**⭐ KEY TABLE FOR API SERVICE**

```sql
CREATE TABLE api_keys (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  name text NOT NULL,
  key_hash text NOT NULL,
  last_used timestamp with time zone,
  expires_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

**Key Features:**
- `key_hash`: Hashed API key (never store raw keys)
- `expires_at`: Optional expiration for keys
- `last_used`: Track API usage
- `is_active`: Enable/disable keys

### `sessions`
User authentication sessions.

```sql
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  token text NOT NULL,
  ip_address text,
  user_agent text,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `oauth_connections`
Third-party authentication connections.

```sql
CREATE TABLE oauth_connections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  provider text NOT NULL,
  provider_user_id text NOT NULL,
  access_token text,
  refresh_token text,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## 🌐 Domain & Monitoring

### `domains`
Monitored domains for breach detection.

```sql
CREATE TABLE domains (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  domain text NOT NULL,
  monitoring_enabled boolean NOT NULL DEFAULT true,
  type character varying NOT NULL DEFAULT 'URL',
  company_name character varying,
  description text,
  is_verified boolean DEFAULT false,
  verified_at timestamp with time zone,
  organization_id uuid REFERENCES organizations(id),
  added_by uuid REFERENCES users(id),
  visibility character varying DEFAULT 'organization',
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

**Types:**
- `URL`: Web domains
- `EMAIL`: Email domains

**Visibility:**
- `organization`: Visible to org members
- `private`: Visible only to owner

### `watchlist`
Items users are monitoring.

```sql
CREATE TABLE watchlist (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  type text NOT NULL,
  value text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  last_checked timestamp with time zone
);
```

---

## 💰 Billing & Subscription

### `plans`
Available subscription plans.

```sql
CREATE TABLE plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  stripe_product_id text,
  stripe_price_monthly text,
  stripe_price_yearly text,
  monthly_price integer NOT NULL,
  yearly_price integer,
  currency text NOT NULL DEFAULT 'usd',
  searches_per_month integer NOT NULL,
  alerts_limit integer NOT NULL,
  watchlist_limit integer NOT NULL,
  api_calls_per_month integer NOT NULL,
  export_limit integer NOT NULL,
  data_retention integer NOT NULL,
  custom_domain boolean NOT NULL DEFAULT false,
  priority_support boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `subscriptions`
User subscription records.

```sql
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  plan_id uuid NOT NULL REFERENCES plans(id),
  status text NOT NULL,
  stripe_subscription_id text,
  stripe_customer_id text,
  current_period_start timestamp with time zone NOT NULL,
  current_period_end timestamp with time zone NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  canceled_at timestamp with time zone,
  trial_start timestamp with time zone,
  trial_end timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

**Statuses:**
- `active`: Currently active
- `canceled`: Will cancel at period end
- `past_due`: Payment failed
- `trialing`: In trial period

### `billing_settings`
User billing preferences.

```sql
CREATE TABLE billing_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  tax_id text,
  tax_type text,
  billing_address jsonb,
  payment_method jsonb,
  auto_renew boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `payments`
Payment transaction records.

```sql
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  subscription_id uuid REFERENCES subscriptions(id),
  stripe_payment_intent_id text,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL,
  payment_method text,
  receipt_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `invoices`
Billing invoices.

```sql
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id uuid NOT NULL REFERENCES subscriptions(id),
  stripe_invoice_id text,
  amount_paid integer NOT NULL,
  amount_due integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL,
  period_start timestamp with time zone NOT NULL,
  period_end timestamp with time zone NOT NULL,
  pdf_url text,
  hosted_invoice_url text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `promo_codes`
Promotional discount codes.

```sql
CREATE TABLE promo_codes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL,
  discount_value integer NOT NULL,
  max_uses integer,
  uses_count integer NOT NULL DEFAULT 0,
  valid_from timestamp with time zone,
  valid_until timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## 📊 Data Processing & Exports

### `data_jobs`
Background data processing jobs.

```sql
CREATE TABLE data_jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  config jsonb NOT NULL,
  result jsonb,
  error text,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

**Job Types:**
- `export`: Data export
- `report`: Report generation
- `cleanup`: Data cleanup

### `export_history`
Export job tracking.

```sql
CREATE TABLE export_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  export_type text NOT NULL,
  query_params jsonb,
  file_size bigint,
  status text NOT NULL DEFAULT 'pending',
  download_url text,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## 📝 Audit & Logging

### `audit_logs`
System-wide audit trail.

```sql
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `usage_history`
**⭐ IMPORTANT FOR API RATE LIMITING**

```sql
CREATE TABLE usage_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  billing_period_start timestamp with time zone NOT NULL,
  billing_period_end timestamp with time zone NOT NULL,
  searches integer NOT NULL DEFAULT 0,
  api_calls integer NOT NULL DEFAULT 0,
  exports integer NOT NULL DEFAULT 0,
  alerts_triggered integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

**Key Fields for API Service:**
- `api_calls`: Number of API calls made
- Billing period tracking for rate limits
- Can be used for real-time usage monitoring

### `search_history`
User search activity tracking.

```sql
CREATE TABLE search_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  query text NOT NULL,
  type text NOT NULL,
  results integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `stripe_events`
Stripe webhook events for billing.

```sql
CREATE TABLE stripe_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_event_id text NOT NULL UNIQUE,
  type text NOT NULL,
  data jsonb NOT NULL,
  processed boolean NOT NULL DEFAULT false,
  error text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## 🔔 Notifications & Alerts

### `alerts`
User-configured breach alerts.

```sql
CREATE TABLE alerts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  name text NOT NULL,
  type text NOT NULL,
  condition jsonb NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  last_triggered timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `alert_notifications`
Individual alert notification records.

```sql
CREATE TABLE alert_notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id uuid NOT NULL REFERENCES alerts(id),
  title text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `announcements`
System-wide announcements.

```sql
CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## ⚙️ System Administration

### `admin_settings`
Global system configuration.

```sql
CREATE TABLE admin_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  maintenance_mode boolean NOT NULL DEFAULT false,
  maintenance_message text,
  registration_enabled boolean NOT NULL DEFAULT true,
  stripe_webhook_secret text,
  smtp_settings jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `admin_stats`
System-wide statistics tracking.

```sql
CREATE TABLE admin_stats (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date date NOT NULL,
  total_users integer NOT NULL DEFAULT 0,
  new_users integer NOT NULL DEFAULT 0,
  active_users integer NOT NULL DEFAULT 0,
  total_searches integer NOT NULL DEFAULT 0,
  total_revenue integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `admin_actions`
Administrator action logging.

```sql
CREATE TABLE admin_actions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id uuid NOT NULL REFERENCES users(id),
  action text NOT NULL,
  target_type text,
  target_id text,
  reason text,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `system_settings`
Key-value system settings.

```sql
CREATE TABLE system_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES users(id),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `feature_flags`
Feature toggle system.

```sql
CREATE TABLE feature_flags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  enabled boolean NOT NULL DEFAULT false,
  rollout_percentage integer DEFAULT 0,
  user_whitelist uuid[],
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## 🎧 Support & Helpdesk

### `support_tickets`
Customer support tickets.

```sql
CREATE TABLE support_tickets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  priority text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  assigned_to uuid REFERENCES users(id),
  resolved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `ticket_messages`
Messages within support tickets.

```sql
CREATE TABLE ticket_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id uuid NOT NULL REFERENCES support_tickets(id),
  sender_id uuid NOT NULL REFERENCES users(id),
  message text NOT NULL,
  is_internal boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

### `content`
CMS content for pages like help docs.

```sql
CREATE TABLE content (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  body text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  author_id uuid NOT NULL REFERENCES users(id),
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## 🔗 Foreign Key Relationships

### Primary Dependencies:
- `users` ← `user_profiles`, `api_keys`, `sessions`, `domains`, `usage_history`
- `organizations` ← `organization_members`, `domains`, `admin_stats`
- `subscriptions` ← `invoices`, `payments`

### Key Relationships for API Service:
1. **`api_keys.user_id` → `users.id`** - API key ownership
2. **`usage_history.user_id` → `users.id`** - Usage tracking per user
3. **`domains.user_id` → `users.id`** - Domain access control

---

## 🚀 API Service Implementation Notes

### Critical Tables for API Service:

1. **`api_keys`** - Core API key management
2. **`usage_history`** - Rate limiting and billing
3. **`audit_logs`** - API access logging
4. **`users`** - User authentication
5. **`organizations`** - Multi-tenant support

### Recommended Indexes for Performance:

```sql
-- API Key lookups
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);

-- Usage tracking
CREATE INDEX idx_usage_history_user_period ON usage_history(user_id, billing_period_start);

-- Audit trails
CREATE INDEX idx_audit_logs_user_created ON audit_logs(user_id, created_at);

-- Domain access
CREATE INDEX idx_domains_user_id ON domains(user_id);
CREATE INDEX idx_domains_organization_id ON domains(organization_id);
```

### Security Considerations:
- Never store raw API keys (use `key_hash` with bcrypt/scrypt)
- Implement rate limiting using `usage_history`
- Log all API access via `audit_logs`
- Support organization-level access control

---

## 📈 Database Size & Performance

### Expected Table Sizes:
- **`api_keys`**: Small (thousands)
- **`usage_history`**: Medium (millions)
- **`audit_logs`**: Large (tens of millions)
- **`domains`**: Medium (hundreds of thousands)

### ClickHouse Integration:
- Large breach data stored in ClickHouse Cloud
- PostgreSQL for user data, billing, authentication
- Real-time sync between systems as needed

---

*This schema documentation was automatically generated and reflects the current database state as of December 1, 2025.*