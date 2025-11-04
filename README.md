# 🔐 LeakJar

**LeakJar** is a powerful, real-time data breach monitoring and analytics platform that helps organizations track, analyze, and respond to leaked credentials and sensitive data across the internet.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-green)](https://supabase.io/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [API Routes](#api-routes)
- [Authentication & Authorization](#authentication--authorization)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

LeakJar provides comprehensive monitoring and analytics for data breaches, leaked credentials, and exposed sensitive information. The platform offers real-time insights, advanced search capabilities, and detailed analytics to help security teams stay ahead of potential threats.

### What LeakJar Does

- **🔍 Real-time Monitoring**: Track leaked data across multiple sources in real-time
- **📊 Analytics Dashboard**: Visualize breach trends, geographic distribution, and attack vectors
- **🌐 Domain Monitoring**: Monitor specific domains for exposed credentials and data
- **🔔 Smart Alerts**: Get notified via email/webhook when new leaks are detected
- **👥 Team Collaboration**: Multi-user support with role-based access control
- **🔌 API Access**: RESTful API for integration with existing security tools
- **📈 Detailed Reports**: Generate comprehensive reports on data exposure

## ✨ Features

### Core Features

- **🎯 Open Search**: Search across millions of leaked records by domain or email
- **📧 Email Monitoring**: Track specific email domains for credential leaks
- **🔗 URL Monitoring**: Monitor URLs for exposed sensitive data
- **🌍 Geographic Analytics**: Interactive world heatmap showing breach origins
- **💻 Browser & OS Statistics**: Analyze attack vectors by browser and operating system
- **📊 Domain Analytics**: Detailed statistics per monitored domain
- **🔑 API Key Management**: Secure API access with key rotation
- **👥 Team Management**: Invite team members and manage permissions
- **⚙️ Advanced Settings**: Customize notifications, export data, and more

### Security Features

- **🔐 Multi-factor Authentication** (via Supabase)
- **👮 Role-based Access Control** (Admin, User roles)
- **🔒 Secure API Authentication** with JWT tokens
- **📝 Audit Logging** for sensitive operations
- **🛡️ Domain Verification** before monitoring

## 🛠 Tech Stack

### Frontend
- **Next.js 15.5** - React framework with App Router
- **React 19.1** - UI library
- **TypeScript 5.9** - Type safety
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - UI components (Radix UI primitives)
- **TanStack Table** - Advanced data tables
- **Chart.js** - Data visualization
- **React Simple Maps** - Geographic visualizations

### Backend
- **Next.js API Routes** - Serverless API
- **Supabase** - Authentication & user management
- **ClickHouse** - High-performance analytics database
- **PostgreSQL** (via Supabase) - User data & settings

### Authentication
- **Supabase Auth** - OAuth, email/password authentication
- **JWT** - Secure session management
- **bcryptjs** - Password hashing

### Developer Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Turbopack** - Fast bundling

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn** >= 1.22.x
- **Git**

You'll also need accounts for:
- **Supabase** (for authentication)
- **ClickHouse** database (for analytics data storage)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/leakjar_nextjs.git
cd leakjar_nextjs
```

### 2. Install Dependencies

```bash
npm install
```

## ⚙️ Environment Setup

### 1. Create Environment File

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your actual values:

```env
# Application
NEXT_PUBLIC_APP_NAME=LeakJar
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_COMPANY_NAME=SEW Inc.

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ClickHouse
CLICKHOUSE_PROTOCOL=https
CLICKHOUSE_HOST=your-clickhouse-host
CLICKHOUSE_PORT=8443
CLICKHOUSE_DB=default
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=your-password
CLICKHOUSE_URL=https://your-clickhouse-url:8443
```

> 📚 For detailed environment variable documentation, see [ENV_SETUP.md](./ENV_SETUP.md)

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
leakjar_nextjs/
├── app/                          # Next.js App Router
│   ├── about/                    # About page
│   ├── account/                  # Account management
│   ├── admin/                    # Admin panel
│   │   └── users/               # User management
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin APIs
│   │   ├── auth/                # Authentication APIs
│   │   ├── browser-stats/       # Browser analytics
│   │   ├── country-stats/       # Geographic analytics
│   │   ├── domain-stats/        # Domain statistics
│   │   ├── leaked-data/         # Leaked data APIs
│   │   ├── leaks/               # Leak information
│   │   ├── open-search/         # Search APIs
│   │   └── teams/               # Team management
│   ├── auth/                    # Auth pages (login, signup)
│   ├── dashboard/               # Main dashboard
│   ├── monitoring/              # Monitoring pages
│   │   ├── all/                # All monitored items
│   │   ├── email/              # Email monitoring
│   │   └── url/                # URL monitoring
│   ├── open-search/            # Search interface
│   ├── settings/               # User settings
│   │   ├── api-keys/          # API key management
│   │   ├── domains/           # Domain settings
│   │   ├── notifications/     # Notification preferences
│   │   └── export/            # Data export
│   ├── teams/                  # Team collaboration
│   └── welcome/                # Onboarding
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components
│   ├── providers/              # Context providers
│   ├── data-grid.tsx          # Reusable data grids
│   ├── charts/                # Chart components
│   └── ...                    # Other components
├── lib/                        # Utility libraries
│   ├── auth.ts                # Auth utilities
│   ├── clickhouse.ts          # ClickHouse client
│   ├── supabase-*.ts          # Supabase clients
│   └── utils.ts               # General utilities
├── hooks/                      # Custom React hooks
├── utils/                      # Helper functions
├── public/                     # Static assets
└── middleware.ts              # Next.js middleware
```

## 🔑 Key Features

### 1. Dashboard
- Real-time statistics overview
- Recent leak alerts
- Quick domain search
- Analytics charts (browsers, countries, OS)

### 2. Open Search
- Search leaked data by domain or email
- Detailed result views with data inspection
- Export search results
- Advanced filtering options

### 3. Monitoring
- **Email Monitoring**: Track specific email domains
- **URL Monitoring**: Watch URLs for data exposure
- Configure alert thresholds
- Webhook integrations

### 4. Analytics
- **Browser Analytics**: Visualize which browsers are most compromised
- **Country Analytics**: Geographic heatmap of breach origins
- **OS Analytics**: Operating system distribution
- **Domain Analytics**: Per-domain statistics and trends

### 5. Team Management
- Invite team members
- Role-based permissions (Admin, User)
- Activity tracking
- Access control

### 6. Settings
- **API Keys**: Generate and manage API keys
- **Domains**: Add and verify domains
- **Notifications**: Configure email/webhook alerts
- **Export**: Download your data

## 🔌 API Routes

### Authentication
- `POST /api/auth/me` - Get current user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Search
- `GET /api/open-search` - Search all leaked data
- `GET /api/open-search/[domain]` - Search by domain

### Analytics
- `GET /api/browser-stats` - Browser statistics
- `GET /api/country-stats` - Geographic statistics
- `GET /api/os-stats` - Operating system statistics
- `GET /api/domain-stats` - Domain statistics
- `GET /api/total-records` - Total record counts

### Data
- `GET /api/leaked-data` - Get leaked data records
- `GET /api/leaks` - Get leak information
- `GET /api/domains` - Get monitored domains

### Admin (Requires Admin Role)
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/[userId]` - Get user details
- `PUT /api/admin/users/[userId]` - Update user
- `DELETE /api/admin/users/[userId]` - Delete user
- `POST /api/admin/users/[userId]/role` - Update user role
- `POST /api/admin/domains/verify` - Verify domain ownership

### Teams
- `GET /api/teams` - List user's teams
- `POST /api/teams` - Create team
- `PUT /api/teams` - Update team
- `DELETE /api/teams` - Delete team

## 🔐 Authentication & Authorization

### User Roles

- **Admin**: Full access to all features including user management
- **User**: Access to monitoring, search, and personal settings

### Authentication Flow

1. User signs up via email/password or OAuth
2. Supabase handles authentication and issues JWT
3. Middleware validates session on protected routes
4. Role-based checks performed at API and UI level

### Protected Routes

All routes except `/`, `/auth/*`, `/about`, `/features`, and `/pricing` require authentication.

## 🗄️ Database Schema

### Supabase (PostgreSQL)
- **users**: User accounts and profiles
- **teams**: Team information
- **team_members**: Team membership
- **api_keys**: API authentication keys
- **monitored_domains**: Domains being monitored
- **notifications**: Notification configurations

### ClickHouse (Analytics)
- **leaked_data**: Main table for leaked credentials
- **leak_sources**: Information about leak sources
- **domain_stats**: Aggregated domain statistics
- **browser_stats**: Browser usage statistics
- **country_stats**: Geographic distribution
- **os_stats**: Operating system statistics

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

```bash
# Using Vercel CLI
npm install -g vercel
vercel
```

### Environment Variables on Vercel

Add all variables from `.env.local` to your Vercel project settings:
- Project Settings → Environment Variables
- Add each variable for Production, Preview, and Development

### Custom Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is proprietary software owned by SEW Inc. All rights reserved.

## 🆘 Support

For support, please contact:
- Email: support@leakjar.com
- Documentation: [docs.leakjar.com](https://docs.leakjar.com)
- Issues: [GitHub Issues](https://github.com/yourusername/leakjar_nextjs/issues)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Authentication by [Supabase](https://supabase.io/)
- Analytics powered by [ClickHouse](https://clickhouse.com/)

---

**Made with ❤️ by SEW Inc.**

