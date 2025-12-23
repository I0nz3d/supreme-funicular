# ReviewHub Deployment Guide

This guide covers different deployment options for ReviewHub.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Local Deployment](#local-deployment)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Environment Configuration](#environment-configuration)
- [Security Checklist](#security-checklist)

---

## Prerequisites

### Required
- Node.js v14.0 or higher
- MongoDB v4.4 or higher
- npm or yarn package manager

### Recommended
- PM2 for process management
- Nginx for reverse proxy
- SSL/TLS certificate

---

## Local Deployment

### Quick Start

1. **Clone and Install**
```bash
git clone https://github.com/I0nz3d/supreme-funicular.git
cd supreme-funicular
npm install
```

2. **Configure Environment**
```bash
npm run setup
# Or manually create .env file
```

3. **Start MongoDB**
```bash
# Using system service
sudo systemctl start mongodb

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

4. **Run Application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

5. **Access Application**
Open http://localhost:3000 in your browser

---

## Production Deployment

### 1. Server Setup (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 (process manager)
sudo npm install -g pm2
```

### 2. Application Deployment

```bash
# Clone repository
cd /var/www
git clone https://github.com/I0nz3d/supreme-funicular.git reviewhub
cd reviewhub

# Install dependencies
npm install --production

# Configure environment
cp .env.example .env
nano .env  # Edit with your production settings
```

### 3. Configure PM2

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'reviewhub',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Configure Nginx (Reverse Proxy)

Create `/etc/nginx/sites-available/reviewhub`:
```nginx
server {
    listen 80;
    server_name reviewhub.example.com;

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

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/reviewhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL/TLS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d reviewhub.example.com

# Auto-renewal (certbot sets this up automatically)
sudo certbot renew --dry-run
```

---

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/reviewhub
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6.0
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

### 3. Deploy with Docker Compose

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Cloud Deployment

### Heroku

1. **Install Heroku CLI**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

2. **Create Heroku App**
```bash
heroku login
heroku create reviewhub-app
```

3. **Add MongoDB**
```bash
heroku addons:create mongolab:sandbox
```

4. **Configure Environment**
```bash
heroku config:set JWT_SECRET=$(openssl rand -hex 32)
heroku config:set NODE_ENV=production
```

5. **Deploy**
```bash
git push heroku main
heroku open
```

### AWS EC2

1. **Launch EC2 Instance** (Ubuntu 20.04 LTS)
2. **Configure Security Group** (ports 22, 80, 443)
3. **Follow Production Deployment steps** above
4. **Set up Elastic IP** for static address
5. **Configure Route 53** for DNS

### DigitalOcean

1. **Create Droplet** (Ubuntu 20.04)
2. **Follow Production Deployment steps** above
3. **Set up domain** in DNS settings
4. **Enable automatic backups**

### Vercel (Frontend + Serverless Functions)

Note: Vercel is better suited for static sites and serverless functions. For full Node.js apps, consider other options.

### Railway

1. **Install Railway CLI**
```bash
npm i -g @railway/cli
```

2. **Initialize and Deploy**
```bash
railway login
railway init
railway add
railway up
```

---

## Environment Configuration

### Production .env Template

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://username:password@host:port/reviewhub

# JWT Authentication (use strong random secret)
JWT_SECRET=your_very_secure_random_secret_at_least_32_characters
JWT_EXPIRE=7d

# Stripe Payment
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email Configuration
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
EMAIL_FROM=noreply@yourcompany.com

# CORS
FRONTEND_URL=https://yourcompany.com

# Optional: Sentry for error tracking
SENTRY_DSN=https://...@sentry.io/...

# Optional: Rate limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100
```

### Generate Secure Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

---

## Security Checklist

### Before Going Live

- [ ] Change all default passwords and secrets
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall (UFW, Security Groups)
- [ ] Configure MongoDB authentication
- [ ] Restrict MongoDB to localhost or private network
- [ ] Set up regular backups
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set secure HTTP headers (helmet.js)
- [ ] Keep dependencies updated
- [ ] Set up monitoring and logging
- [ ] Create admin user separately from code
- [ ] Validate all user inputs
- [ ] Use parameterized queries
- [ ] Implement CSRF protection
- [ ] Set up security alerts

### MongoDB Security

```javascript
// Enable authentication
use admin
db.createUser({
  user: "reviewhub_admin",
  pwd: "strong_password_here",
  roles: [ { role: "readWrite", db: "reviewhub" } ]
})

// Update .env
MONGODB_URI=mongodb://reviewhub_admin:strong_password_here@localhost:27017/reviewhub
```

### Firewall Configuration (UFW)

```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

## Monitoring & Maintenance

### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs reviewhub

# Restart application
pm2 restart reviewhub

# View status
pm2 status
```

### Database Backups

```bash
# Manual backup
mongodump --db reviewhub --out /backup/$(date +%Y%m%d)

# Automated backup (add to crontab)
0 2 * * * mongodump --db reviewhub --out /backup/$(date +\%Y\%m\%d)
```

### Application Updates

```bash
# Stop application
pm2 stop reviewhub

# Pull latest code
git pull origin main

# Install dependencies
npm install --production

# Restart application
pm2 restart reviewhub
```

---

## Performance Optimization

### 1. Enable Compression

Add to server.js:
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Static File Caching

```javascript
app.use(express.static('public', {
  maxAge: '1d'
}));
```

### 3. Database Indexes

Already configured in models. Verify:
```javascript
// In MongoDB shell
db.reviews.getIndexes()
db.users.getIndexes()
```

### 4. Enable Nginx Gzip

Add to nginx config:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

---

## Troubleshooting

### Application Won't Start

1. Check logs: `pm2 logs reviewhub`
2. Verify MongoDB is running: `sudo systemctl status mongod`
3. Check .env file exists and is configured
4. Verify port is not in use: `lsof -i :3000`

### Database Connection Errors

1. Verify MongoDB is running
2. Check MONGODB_URI in .env
3. Test connection: `mongo "mongodb://your_uri"`
4. Check firewall rules

### High Memory Usage

1. Monitor with: `pm2 monit`
2. Restart application: `pm2 restart reviewhub`
3. Check for memory leaks in logs
4. Consider scaling horizontally

---

## Scaling Strategies

### Vertical Scaling
- Upgrade server resources (CPU, RAM)
- Optimize database queries
- Add caching layer (Redis)

### Horizontal Scaling
- Use PM2 cluster mode
- Add load balancer
- Deploy multiple instances
- Use managed database (MongoDB Atlas)

---

## Support

For deployment issues:
- Check documentation: README.md, API.md
- Open issue on GitHub
- Contact: support@reviewhub.com

---

## Quick Reference

```bash
# Start application
npm start

# Development mode
npm run dev

# View logs (PM2)
pm2 logs reviewhub

# Restart (PM2)
pm2 restart reviewhub

# Database backup
mongodump --db reviewhub --out /backup/

# Check status
pm2 status
sudo systemctl status mongod
sudo systemctl status nginx
```
