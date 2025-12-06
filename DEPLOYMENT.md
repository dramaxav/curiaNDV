# Légion de Marie - Next.js Deployment Guide

## Overview

This project has been migrated from Vite + Express + React Router to **Next.js 14** with the App Router. It's now ready to be deployed on any local server with Node.js support.

## Prerequisites

### System Requirements
- **Node.js**: 18.17 or higher
- **npm** or **yarn** or **pnpm** (package managers)
- **Disk Space**: ~500MB for installation and build

### Supported Servers
- **Windows**: Node.js with any HTTP server (IIS with iisnode, or standalone Node.js server)
- **Linux/Mac**: Node.js with any HTTP server
- **Docker**: Container-based deployment

## Installation & Setup

### 1. Install Dependencies

```bash
cd code
npm install
```

Or with yarn:
```bash
yarn install
```

Or with pnpm:
```bash
pnpm install
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration if needed:
```env
PORT=3000
NODE_ENV=development
PING_MESSAGE=pong
```

## Development Mode

### Start Development Server

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`

### Features in Development
- Hot module reloading
- TypeScript checking
- Built-in API routes at `/api/*`
- Automatic route-based code splitting

## Production Deployment

### 1. Build the Application

```bash
npm run build
```

This creates:
- `.next/` directory: Optimized production code
- Output directory: Ready for deployment

### 2. Start Production Server

```bash
npm start
```

The application will start on the port specified in `.env.local` (default: 3000)

## Deployment Options

### Option 1: Local Windows Server (Recommended for WAMP-like setup)

#### Prerequisites
- Node.js installed
- Port access (typically 3000, 3001, or 8080)

#### Steps
1. Build the project:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Access at `http://localhost:3000` or `http://<your-ip>:3000`

4. **Persistent Running** (Windows Service):
   - Use **PM2** for process management:
     ```bash
     npm install -g pm2
     pm2 start "npm start" --name "legion-de-marie"
     pm2 startup
     pm2 save
     ```

#### Firewall Configuration
- Allow Node.js through Windows Firewall
- Or configure port forwarding on your router

### Option 2: Docker Deployment

#### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next/standalone ./
COPY .next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

#### Build and Run

```bash
docker build -t legion-de-marie .
docker run -p 3000:3000 legion-de-marie
```

### Option 3: Linux/Mac Server

#### Using systemd service (Linux)

Create `/etc/systemd/system/legion-de-marie.service`:

```ini
[Unit]
Description=Légion de Marie Web Application
After=network.target

[Service]
User=www-data
WorkingDirectory=/home/user/legion-de-marie
Environment="PATH=/usr/bin"
Environment="NODE_ENV=production"
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then enable and start:
```bash
sudo systemctl enable legion-de-marie
sudo systemctl start legion-de-marie
```

#### Using PM2 (Cross-platform)

```bash
npm install -g pm2

# Start application
pm2 start "npm start" --name "legion-de-marie"

# Make it start on system boot
pm2 startup
pm2 save

# Monitor
pm2 monit
```

## Reverse Proxy Configuration

### Nginx (Linux/Mac)

```nginx
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
    }
}
```

### Apache (Windows/Linux)

Enable modules:
```bash
a2enmod proxy
a2enmod proxy_http
a2enmod rewrite
```

Configure VirtualHost:
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

## Database & External Services

The application includes:
- **Authentication**: Mock authentication (localStorage-based for demo)
- **API Routes**: Located in `app/api/` directory

### Connecting Real Services

For production:
1. [Connect to Supabase](https://www.builder.io/c/docs) for database and auth
2. [Connect to Neon](https://www.builder.io/c/docs) for PostgreSQL
3. Implement API routes in `app/api/` for database operations

## Performance Optimization

### Caching Headers
Next.js automatically handles static asset caching with proper headers.

### Database Connection Pooling
For production databases, configure connection pooling in your API routes.

### Monitoring
Monitor server resources:
```bash
# With PM2
pm2 monit

# Manual monitoring
npm install -g pm2
pm2 logs
```

## Troubleshooting

### Port Already in Use
```bash
# Windows: Find process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac: Find and kill process
lsof -i :3000
kill -9 <PID>
```

### Build Failures
```bash
# Clean install
rm -rf .next node_modules
npm install
npm run build
```

### Memory Issues
Increase Node.js memory:
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

## SSL/HTTPS Configuration

### Using Let's Encrypt with Nginx

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly -a nginx -d your-domain.com
```

Then update Nginx config with SSL certificates.

## Security Checklist

- [ ] Change default authentication mechanism to real auth provider
- [ ] Configure CORS for API endpoints
- [ ] Set environment variables securely (not in git)
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Regular security updates (`npm audit`, `npm update`)
- [ ] Monitor logs for suspicious activity
- [ ] Backup database regularly

## Monitoring & Logging

### Application Logs
```bash
pm2 logs legion-de-marie
```

### System Logs (Linux)
```bash
journalctl -u legion-de-marie -f
```

### New Relic / Datadog Integration
Refer to respective documentation for monitoring integration.

## Rollback Procedure

1. Backup current `.next` directory
2. Restore previous version from version control
3. `npm run build`
4. `npm start`

## Performance Tips

1. **Image Optimization**: Next.js automatically optimizes images
2. **Code Splitting**: Routes are automatically code-split
3. **Caching**: Configure ISR (Incremental Static Regeneration) for static pages
4. **Compression**: Enable gzip in reverse proxy

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-performance-example/)

## Maintenance

### Regular Tasks
- Weekly: Check error logs
- Monthly: Update dependencies (`npm update`)
- Quarterly: Full security audit (`npm audit`)

### Backup Strategy
- Daily: Database backups
- Weekly: Full application backups
- Monthly: Offsite storage

## Contact & Support

For issues or questions about deployment:
1. Check the troubleshooting section above
2. Review server logs
3. Consult Next.js documentation
