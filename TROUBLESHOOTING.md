# Troubleshooting Guide

This guide helps you diagnose and fix common issues with LeakJar.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Runtime Errors](#runtime-errors)
- [Database Connection Issues](#database-connection-issues)
- [Authentication Issues](#authentication-issues)
- [Performance Issues](#performance-issues)
- [Build and Deployment Issues](#build-and-deployment-issues)
- [Getting Help](#getting-help)

## Installation Issues

### NPM Install Fails

**Symptoms:**
```bash
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use legacy peer deps:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Update Node.js:**
   ```bash
   # Check current version
   node --version
   
   # Should be >= 18.x
   # Update using nvm
   nvm install 18
   nvm use 18
   ```

### Port Already in Use

**Symptoms:**
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

1. **Kill process on port 3000:**
   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Use a different port:**
   ```bash
   npm run dev -- --port 3001
   ```

3. **The predev script handles this automatically:**
   ```bash
   npm run dev
   ```

## Runtime Errors

### Environment Variables Not Defined

**Symptoms:**
```
Error: process.env.NEXT_PUBLIC_SUPABASE_URL is undefined
```

**Solutions:**

1. **Create .env.local file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Restart dev server after adding variables:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Check variable naming:**
   - Browser-accessible variables must start with `NEXT_PUBLIC_`
   - Server-only variables have no prefix

4. **Verify .env.local is not in .gitignore:**
   ```bash
   # It should be ignored (correct)
   cat .gitignore | grep .env.local
   ```

### Module Not Found

**Symptoms:**
```
Error: Cannot find module '@/components/ui/button'
```

**Solutions:**

1. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check path aliases in tsconfig.json:**
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

3. **Restart TypeScript server in VSCode:**
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
   - Type "TypeScript: Restart TS Server"

### Hydration Errors

**Symptoms:**
```
Warning: Text content did not match. Server: "..." Client: "..."
```

**Solutions:**

1. **Check for client-only code in server components:**
   ```typescript
   // Bad - using localStorage in server component
   const value = localStorage.getItem('key');
   
   // Good - use client component
   'use client';
   const value = localStorage.getItem('key');
   ```

2. **Ensure consistent date formatting:**
   ```typescript
   // Bad - different timezone on server/client
   new Date().toString()
   
   // Good - use ISO format
   new Date().toISOString()
   ```

3. **Suppress specific warnings (last resort):**
   ```typescript
   <div suppressHydrationWarning>
     {new Date().toLocaleDateString()}
   </div>
   ```

## Database Connection Issues

### ClickHouse Connection Failed

**Symptoms:**
```
Error: connect ETIMEDOUT
Error: Authentication failed
```

**Solutions:**

1. **Verify connection string:**
   ```bash
   # In .env.local
   CLICKHOUSE_URL=https://your-host:8443
   CLICKHOUSE_HOST=your-host.com
   CLICKHOUSE_PORT=8443
   ```

2. **Test connection manually:**
   ```bash
   curl https://your-clickhouse-host:8443/ping
   ```

3. **Check firewall rules:**
   - Ensure port 8443 (HTTPS) or 8123 (HTTP) is open
   - Whitelist your IP address in ClickHouse Cloud

4. **Verify credentials:**
   ```bash
   # Test with clickhouse-client
   clickhouse-client --host your-host \
                     --port 9000 \
                     --user default \
                     --password your-password
   ```

### Supabase Connection Issues

**Symptoms:**
```
Error: Invalid API key
Error: Failed to fetch
```

**Solutions:**

1. **Verify Supabase credentials:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the correct URL and keys
   - Ensure no extra spaces in .env.local

2. **Check project status:**
   - Ensure Supabase project is not paused
   - Verify you're using the correct project

3. **Test connection:**
   ```typescript
   // Test in browser console
   const { data, error } = await supabase.auth.getSession();
   console.log({ data, error });
   ```

4. **Clear Supabase cache:**
   ```bash
   # Clear browser storage
   localStorage.clear();
   sessionStorage.clear();
   ```

### Database Query Timeout

**Symptoms:**
```
Error: Query timeout exceeded
```

**Solutions:**

1. **Optimize queries with indexes:**
   ```sql
   CREATE INDEX idx_domain ON leaked_data(domain);
   CREATE INDEX idx_date ON leaked_data(leak_date);
   ```

2. **Add query limits:**
   ```typescript
   // Bad
   const data = await clickhouse.query('SELECT * FROM leaked_data');
   
   // Good
   const data = await clickhouse.query(
     'SELECT * FROM leaked_data LIMIT 1000'
   );
   ```

3. **Use pagination:**
   ```typescript
   const limit = 100;
   const offset = page * limit;
   const query = `SELECT * FROM leaked_data LIMIT ${limit} OFFSET ${offset}`;
   ```

## Authentication Issues

### Can't Log In

**Symptoms:**
- Login button does nothing
- Redirect loop
- "Invalid credentials" error

**Solutions:**

1. **Clear browser data:**
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   // Then hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
   ```

2. **Check Supabase authentication settings:**
   - Dashboard → Authentication → Settings
   - Ensure Email auth is enabled
   - Check Site URL is correct

3. **Verify redirect URLs:**
   - Dashboard → Authentication → URL Configuration
   - Add `http://localhost:3000/auth/callback` for dev
   - Add production URL for deployment

4. **Check middleware configuration:**
   ```typescript
   // middleware.ts
   export const config = {
     matcher: [
       '/((?!api|_next/static|_next/image|favicon.ico).*)',
     ],
   };
   ```

### Session Expires Too Quickly

**Symptoms:**
- Logged out after a few minutes
- Constant "Session expired" messages

**Solutions:**

1. **Configure session duration in Supabase:**
   - Dashboard → Authentication → Settings
   - Increase "JWT expiry limit"

2. **Implement token refresh:**
   ```typescript
   // In your auth provider
   useEffect(() => {
     const { data: { subscription } } = supabase.auth.onAuthStateChange(
       async (event, session) => {
         if (event === 'TOKEN_REFRESHED') {
           console.log('Token refreshed');
         }
       }
     );
     
     return () => subscription.unsubscribe();
   }, []);
   ```

### Unauthorized API Requests

**Symptoms:**
```
403 Forbidden
401 Unauthorized
```

**Solutions:**

1. **Check API key headers:**
   ```typescript
   fetch('/api/endpoint', {
     headers: {
       'Authorization': `Bearer ${apiKey}`,
       'Content-Type': 'application/json'
     }
   });
   ```

2. **Verify role-based access:**
   ```typescript
   // Check user role
   const { data: { user } } = await supabase.auth.getUser();
   console.log(user?.user_metadata?.role);
   ```

3. **Check middleware is running:**
   ```typescript
   // Add logging in middleware.ts
   console.log('Middleware running for:', request.url);
   ```

## Performance Issues

### Slow Page Load

**Symptoms:**
- Pages take more than 3 seconds to load
- High Time to First Byte (TTFB)

**Solutions:**

1. **Enable Next.js caching:**
   ```typescript
   // In API routes
   export const revalidate = 60; // Cache for 60 seconds
   
   // In page components
   export const dynamic = 'force-static';
   ```

2. **Optimize database queries:**
   ```typescript
   // Use indexes
   // Limit result sets
   // Add WHERE clauses
   ```

3. **Implement pagination:**
   ```typescript
   const PAGE_SIZE = 50;
   const [page, setPage] = useState(0);
   ```

4. **Lazy load components:**
   ```typescript
   import dynamic from 'next/dynamic';
   
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <Skeleton />
   });
   ```

### High Memory Usage

**Symptoms:**
```
JavaScript heap out of memory
```

**Solutions:**

1. **Increase Node.js memory:**
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run dev
   ```

2. **Optimize data fetching:**
   ```typescript
   // Bad - loading everything
   const allData = await fetchAll();
   
   // Good - paginate
   const pageData = await fetchPage(page, limit);
   ```

3. **Clear unused data:**
   ```typescript
   useEffect(() => {
     return () => {
       // Cleanup
       setLargeData(null);
     };
   }, []);
   ```

### Slow Chart Rendering

**Symptoms:**
- Charts take long to render
- Browser becomes unresponsive

**Solutions:**

1. **Reduce data points:**
   ```typescript
   // Aggregate data before charting
   const aggregated = rawData.reduce((acc, item) => {
     // Group by date/category
     return acc;
   }, []);
   ```

2. **Use chart decimation:**
   ```typescript
   const options = {
     plugins: {
       decimation: {
         enabled: true,
         algorithm: 'lttb'
       }
     }
   };
   ```

3. **Debounce updates:**
   ```typescript
   import { useDebouncedCallback } from 'use-debounce';
   
   const updateChart = useDebouncedCallback((data) => {
     setChartData(data);
   }, 300);
   ```

## Build and Deployment Issues

### Build Fails with TypeScript Errors

**Symptoms:**
```
Type error: Property 'x' does not exist on type 'Y'
```

**Solutions:**

1. **Fix type errors:**
   ```typescript
   // Add proper types
   interface Props {
     name: string;
   }
   
   function Component({ name }: Props) {
     // ...
   }
   ```

2. **Temporarily skip type checking (not recommended):**
   ```json
   // next.config.ts
   {
     "typescript": {
       "ignoreBuildErrors": true
     }
   }
   ```

### Vercel Deployment Fails

**Symptoms:**
- Build succeeds locally but fails on Vercel
- Environment variables not working

**Solutions:**

1. **Check build logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on failed deployment
   - Review logs for errors

2. **Verify environment variables:**
   - Project Settings → Environment Variables
   - Ensure all required variables are set
   - Check variable names match exactly

3. **Clear build cache:**
   - Vercel Dashboard → Settings → General
   - Click "Clear Build Cache & Redeploy"

### Static Export Issues

**Symptoms:**
```
Error: Dynamic routes cannot be used with output: 'export'
```

**Solutions:**

1. **Use static params:**
   ```typescript
   export async function generateStaticParams() {
     return [
       { slug: 'post-1' },
       { slug: 'post-2' }
     ];
   }
   ```

2. **Remove dynamic API routes:**
   - Static export doesn't support API routes
   - Use external API instead

## Getting Help

### Debug Mode

Enable detailed logging:

```bash
# .env.local
DEBUG=*
NEXT_DEBUG=1
```

### Collect System Information

```bash
# Node version
node --version

# NPM version
npm --version

# Next.js version
npm list next

# Operating system
uname -a  # macOS/Linux
ver       # Windows
```

### Check Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for errors (red messages)
4. Copy error messages for support

### Network Tab

1. Open Developer Tools (F12)
2. Go to Network tab
3. Reload page
4. Check for failed requests (red)
5. Click request to see details

### Contact Support

When requesting help, please provide:

1. **Error message** (full text)
2. **Steps to reproduce**
3. **Expected vs actual behavior**
4. **System information**
5. **Screenshots** (if applicable)

**Support Channels:**
- 📧 Email: support@leakjar.com
- 💬 GitHub Issues: [Create Issue](https://github.com/SEWORKSINC/leakjar_nextjs/issues)
- 📚 Documentation: https://docs.leakjar.com

**Project Leads:**
- 👤 Ryan Lee: Slack DM or [ryan.lee@se.works](mailto:ryan.lee@se.works)
- 👤 Min Hong: [min.hong@se.works](mailto:min.hong@se.works)

## Common Error Messages

### ECONNREFUSED

**Meaning:** Cannot connect to server
**Fix:** Ensure server is running and port is correct

### CORS Error

**Meaning:** Cross-Origin Resource Sharing blocked
**Fix:** Configure CORS in Next.js config or API routes

### 404 Not Found

**Meaning:** Route doesn't exist
**Fix:** Check file structure and routing

### 500 Internal Server Error

**Meaning:** Server-side error
**Fix:** Check server logs, verify database connection

---

**Still having issues?** Contact support@leakjar.com with details about your problem.

