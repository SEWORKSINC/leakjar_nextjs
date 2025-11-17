# LeakJar API Documentation

## Overview

LeakJar provides a comprehensive RESTful API for accessing leaked data, analytics, and managing your account. All API endpoints require authentication unless otherwise specified.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

### API Key Authentication

Include your API key in the request headers:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://your-domain.com/api/endpoint
```

### Session Authentication

For browser-based requests, authentication is handled via session cookies provided by Supabase.

## API Endpoints

### Authentication

#### Get Current User

```http
GET /api/auth/me
```

Returns information about the currently authenticated user.

**Response:**
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Get User Profile

```http
GET /api/auth/profile
```

**Response:**
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://...",
  "role": "user",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Update Profile

```http
PUT /api/auth/profile
Content-Type: application/json

{
  "full_name": "Jane Doe",
  "avatar_url": "https://..."
}
```

### Search

#### Open Search (All Leaks)

```http
GET /api/open-search?query={search_term}&limit={limit}&offset={offset}
```

**Parameters:**
- `query` (required): Email or domain to search
- `limit` (optional): Number of results (default: 100, max: 1000)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "results": [
    {
      "email": "user@example.com",
      "password": "hashed_password",
      "domain": "example.com",
      "source": "breach-2024",
      "leak_date": "2024-01-01T00:00:00Z",
      "browser": "Chrome",
      "os": "Windows",
      "country": "US"
    }
  ],
  "total": 1500,
  "limit": 100,
  "offset": 0
}
```

#### Search by Domain

```http
GET /api/open-search/{domain}?limit={limit}&offset={offset}
```

**Parameters:**
- `domain` (required): Domain to search (in path)
- `limit` (optional): Number of results
- `offset` (optional): Pagination offset

### Analytics

#### Browser Statistics

```http
GET /api/browser-stats?domain={domain}&start_date={date}&end_date={date}
```

**Parameters:**
- `domain` (optional): Filter by domain
- `start_date` (optional): Start date (ISO format)
- `end_date` (optional): End date (ISO format)

**Response:**
```json
{
  "stats": [
    {
      "browser": "Chrome",
      "count": 1500,
      "percentage": 45.5
    },
    {
      "browser": "Firefox",
      "count": 800,
      "percentage": 24.2
    }
  ],
  "total": 3300
}
```

#### Country Statistics

```http
GET /api/country-stats?domain={domain}&start_date={date}&end_date={date}
```

**Response:**
```json
{
  "stats": [
    {
      "country": "US",
      "country_name": "United States",
      "count": 2000,
      "percentage": 40.0
    },
    {
      "country": "GB",
      "country_name": "United Kingdom",
      "count": 1000,
      "percentage": 20.0
    }
  ],
  "total": 5000
}
```

#### Operating System Statistics

```http
GET /api/os-stats?domain={domain}&start_date={date}&end_date={date}
```

**Response:**
```json
{
  "stats": [
    {
      "os": "Windows",
      "count": 2500,
      "percentage": 62.5
    },
    {
      "os": "macOS",
      "count": 1000,
      "percentage": 25.0
    }
  ],
  "total": 4000
}
```

#### Domain Statistics

```http
GET /api/domain-stats?domains={domain1,domain2}
```

**Parameters:**
- `domains` (optional): Comma-separated list of domains

**Response:**
```json
{
  "stats": [
    {
      "domain": "example.com",
      "total_leaks": 5000,
      "unique_emails": 3000,
      "latest_leak": "2024-01-01T00:00:00Z",
      "risk_score": 85
    }
  ]
}
```

#### Total Records

```http
GET /api/total-records
```

**Response:**
```json
{
  "total_records": 1500000,
  "unique_domains": 5000,
  "unique_emails": 500000,
  "last_updated": "2024-01-01T00:00:00Z"
}
```

### Data Access

#### Get Leaked Data

```http
GET /api/leaked-data?domain={domain}&limit={limit}&offset={offset}
```

**Parameters:**
- `domain` (optional): Filter by domain
- `limit` (optional): Number of results
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "data": [
    {
      "id": "leak-123",
      "email": "user@example.com",
      "domain": "example.com",
      "password": "hashed_value",
      "leak_date": "2024-01-01T00:00:00Z",
      "source": "breach-2024",
      "metadata": {
        "browser": "Chrome",
        "os": "Windows",
        "ip": "192.168.1.1"
      }
    }
  ],
  "total": 1000,
  "limit": 100,
  "offset": 0
}
```

#### Get Leak Sources

```http
GET /api/leaks
```

**Response:**
```json
{
  "leaks": [
    {
      "id": "leak-source-123",
      "name": "breach-2024",
      "date": "2024-01-01",
      "records": 1000000,
      "description": "Major data breach affecting...",
      "verified": true
    }
  ]
}
```

### Domains

#### List Monitored Domains

```http
GET /api/domains
```

**Response:**
```json
{
  "domains": [
    {
      "id": "domain-123",
      "domain": "example.com",
      "verified": true,
      "monitoring_enabled": true,
      "alert_threshold": 10,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Add Domain

```http
POST /api/domains
Content-Type: application/json

{
  "domain": "example.com",
  "alert_threshold": 10
}
```

#### Update Domain

```http
PUT /api/domains
Content-Type: application/json

{
  "id": "domain-123",
  "alert_threshold": 20,
  "monitoring_enabled": false
}
```

#### Delete Domain

```http
DELETE /api/domains?id={domain_id}
```

### Teams

#### List Teams

```http
GET /api/teams
```

**Response:**
```json
{
  "teams": [
    {
      "id": "team-123",
      "name": "Security Team",
      "role": "owner",
      "members_count": 5,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Team

```http
POST /api/teams
Content-Type: application/json

{
  "name": "New Security Team"
}
```

#### Update Team

```http
PUT /api/teams
Content-Type: application/json

{
  "id": "team-123",
  "name": "Updated Team Name"
}
```

#### Delete Team

```http
DELETE /api/teams?id={team_id}
```

### Admin Routes (Admin Only)

#### List All Users

```http
GET /api/admin/users?limit={limit}&offset={offset}
```

**Response:**
```json
{
  "users": [
    {
      "id": "user-123",
      "email": "user@example.com",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-02T00:00:00Z"
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

#### Get User Details

```http
GET /api/admin/users/{userId}
```

#### Update User

```http
PUT /api/admin/users/{userId}
Content-Type: application/json

{
  "role": "admin",
  "active": true
}
```

#### Delete User

```http
DELETE /api/admin/users/{userId}
```

#### Update User Role

```http
POST /api/admin/users/{userId}/role
Content-Type: application/json

{
  "role": "admin"
}
```

#### Verify Domain

```http
POST /api/admin/domains/verify
Content-Type: application/json

{
  "domain_id": "domain-123"
}
```

## Error Responses

All endpoints return standard HTTP status codes and error messages:

### 400 Bad Request
```json
{
  "error": "Invalid parameters",
  "message": "The 'domain' parameter must be a valid domain name"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "The requested resource was not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate Limit Exceeded",
  "message": "Too many requests. Please try again later.",
  "retry_after": 60
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

API requests are rate-limited to ensure fair usage:

- **Authenticated users**: 1000 requests per hour
- **API key users**: 5000 requests per hour
- **Admin users**: 10000 requests per hour

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

Endpoints that return lists support pagination:

**Parameters:**
- `limit`: Number of items per page (default: 100, max: 1000)
- `offset`: Starting position (default: 0)

**Response includes:**
```json
{
  "results": [...],
  "total": 5000,
  "limit": 100,
  "offset": 0,
  "has_more": true
}
```

## Filtering

Many endpoints support filtering:

**Date Ranges:**
```http
GET /api/endpoint?start_date=2024-01-01&end_date=2024-12-31
```

**Domain Filtering:**
```http
GET /api/endpoint?domain=example.com
```

**Multiple Filters:**
```http
GET /api/endpoint?domain=example.com&start_date=2024-01-01&limit=50
```

## Webhooks

Configure webhooks to receive real-time notifications:

### Webhook Events

- `leak.detected` - New leak detected for monitored domain
- `domain.verified` - Domain verification completed
- `threshold.exceeded` - Alert threshold exceeded

### Webhook Payload

```json
{
  "event": "leak.detected",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "domain": "example.com",
    "leak_count": 150,
    "source": "breach-2024"
  }
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const client = axios.create({
  baseURL: 'https://your-domain.com/api',
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  }
});

// Search for leaks
const searchLeaks = async (query: string) => {
  const response = await client.get('/open-search', {
    params: { query, limit: 100 }
  });
  return response.data;
};

// Get analytics
const getBrowserStats = async () => {
  const response = await client.get('/browser-stats');
  return response.data;
};
```

### Python

```python
import requests

class LeakJarAPI:
    def __init__(self, api_key: str, base_url: str):
        self.base_url = base_url
        self.headers = {'Authorization': f'Bearer {api_key}'}
    
    def search_leaks(self, query: str, limit: int = 100):
        response = requests.get(
            f'{self.base_url}/open-search',
            headers=self.headers,
            params={'query': query, 'limit': limit}
        )
        return response.json()
    
    def get_browser_stats(self):
        response = requests.get(
            f'{self.base_url}/browser-stats',
            headers=self.headers
        )
        return response.json()

# Usage
api = LeakJarAPI('your-api-key', 'https://your-domain.com/api')
results = api.search_leaks('example.com')
```

## Support

For API support and questions:

### General API Support
- Email: api-support@leakjar.com
- Documentation: https://docs.leakjar.com/api
- Status Page: https://status.leakjar.com

### Project Leads
For technical questions and API guidance:
- **Ryan Lee**: Slack DM or [ryan.lee@se.works](mailto:ryan.lee@se.works)
- **Min Hong**: [min.hong@se.works](mailto:min.hong@se.works)

