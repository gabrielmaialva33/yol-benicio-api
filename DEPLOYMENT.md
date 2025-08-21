# 🚀 Deployment Guide - Yol Benício Legal Management System

This guide covers the complete CI/CD setup and deployment process for the Yol Benício Legal Management System.

## 📋 Overview

The system uses a modern CI/CD pipeline with:
- **GitHub Actions** for automated testing and deployment
- **Docker** for containerization
- **PostgreSQL with TimescaleDB** for database
- **Redis** for caching and queues
- **VPS deployment** to `72.60.9.175`

## 🏗️ Architecture

```
GitHub Repository
       ↓
GitHub Actions CI/CD
       ↓
Docker Registry (GHCR)
       ↓
VPS Server (72.60.9.175)
       ↓
Docker Compose Stack
```

## 🔧 Initial Setup

### 1. Repository Secrets Configuration

Add the following secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

```bash
# VPS Access
VPS_HOST=72.60.9.175
VPS_SSH_KEY=<your-private-ssh-key>

# GitHub Container Registry
GITHUB_TOKEN=<automatic-github-token>

# Production Environment Variables
PRODUCTION_APP_KEY=<32-character-app-key>
PRODUCTION_DB_PASSWORD=<secure-postgres-password>
PRODUCTION_REDIS_PASSWORD=<secure-redis-password>
PRODUCTION_JWT_ACCESS_SECRET=<jwt-access-secret>
PRODUCTION_JWT_REFRESH_SECRET=<jwt-refresh-secret>

# Email Configuration
PRODUCTION_SMTP_USER=<email-address>
PRODUCTION_SMTP_PASS=<email-app-password>

# File Storage (Choose one)
PRODUCTION_AWS_ACCESS_KEY_ID=<aws-access-key>
PRODUCTION_AWS_SECRET_ACCESS_KEY=<aws-secret-key>
PRODUCTION_S3_BUCKET=<s3-bucket-name>
```

### 2. VPS Server Preparation

Connect to your VPS and run these commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create project directory
mkdir -p /root/yol-benicio-api
cd /root/yol-benicio-api

# Clone repository
git clone https://github.com/your-username/yol-benicio-api.git .

# Copy production environment file
cp .env.production .env

# Edit environment variables
nano .env
```

### 3. Environment Configuration

Update the `.env` file with your production values:

```bash
# Generate a secure APP_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Use strong passwords for database and Redis
# Configure your email SMTP settings
# Set up file storage credentials
```

## 🔄 CI/CD Pipeline

### Workflow Stages

1. **Test Stage**
   - Runs on every push and pull request
   - Sets up PostgreSQL and Redis services
   - Installs dependencies with pnpm
   - Runs database migrations and seeds
   - Executes linting, type checking, and tests

2. **Build Stage**
   - Builds Docker image
   - Pushes to GitHub Container Registry
   - Tags with branch name and commit SHA

3. **Deploy Stage**
   - Runs only on `master` branch pushes
   - Connects to VPS via SSH
   - Pulls latest Docker image
   - Updates docker-compose stack
   - Runs database migrations
   - Performs health checks

### Manual Deployment

For manual deployment, use the provided script:

```bash
# On VPS server
cd /root/yol-benicio-api
./scripts/deploy.sh [image-tag]
```

## 🏥 Health Checks

The application includes comprehensive health monitoring:

### Endpoints

- `GET /health` - Complete health check (database, Redis, environment)
- `GET /health/ready` - Readiness check (ready to receive traffic)
- `GET /health/live` - Liveness check (application is running)

### CLI Command

```bash
# Check application health via CLI
node ace healthcheck
```

### Docker Health Check

```bash
# Check container health
docker-compose ps
docker-compose exec app node ace healthcheck
```

## 📊 Monitoring

### Container Logs

```bash
# View application logs
docker-compose logs -f app

# View database logs
docker-compose logs -f postgres

# View Redis logs
docker-compose logs -f redis
```

### System Monitoring

```bash
# Check container resource usage
docker stats

# Check disk usage
df -h

# Check memory usage
free -h

# Check running processes
htop
```

## 🔒 Security Considerations

### SSL/TLS Setup

1. **Install Certbot**
```bash
sudo apt install certbot python3-certbot-nginx
```

2. **Obtain SSL Certificate**
```bash
sudo certbot --nginx -d benicio.mahina.cloud
```

3. **Auto-renewal**
```bash
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall Configuration

```bash
# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Database Security

```bash
# Change default PostgreSQL password
docker-compose exec postgres psql -U postgres -c "ALTER USER postgres PASSWORD 'your-new-secure-password';"

# Update .env file with new password
```

## 🔄 Backup Strategy

### Automated Backups

The deployment script creates automatic backups before each deployment.

### Manual Backup

```bash
# Database backup
docker-compose exec postgres pg_dump -U postgres postgres > backup_$(date +%Y%m%d_%H%M%S).sql

# Application files backup
tar -czf backup_files_$(date +%Y%m%d_%H%M%S).tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=storage/logs \
  .
```

### Restore from Backup

```bash
# Restore database
docker-compose exec -T postgres psql -U postgres -d postgres < backup.sql

# Restore files
tar -xzf backup_files.tar.gz
```

## 🚨 Troubleshooting

### Common Issues

1. **Container won't start**
```bash
# Check logs
docker-compose logs app

# Check environment variables
docker-compose exec app env | grep -E '(DB_|REDIS_|APP_)'
```

2. **Database connection issues**
```bash
# Test database connectivity
docker-compose exec app node ace healthcheck

# Check PostgreSQL status
docker-compose exec postgres pg_isready -U postgres
```

3. **Redis connection issues**
```bash
# Test Redis connectivity
docker-compose exec redis redis-cli ping

# Check Redis logs
docker-compose logs redis
```

4. **Migration failures**
```bash
# Run migrations manually
docker-compose exec app node ace migration:run --force

# Reset database (DANGER: This will delete all data)
docker-compose exec app node ace migration:reset --force
docker-compose exec app node ace migration:run --force
docker-compose exec app node ace db:seed --force
```

### Performance Issues

1. **High memory usage**
```bash
# Check container memory usage
docker stats

# Restart containers
docker-compose restart
```

2. **Slow database queries**
```bash
# Enable query logging in PostgreSQL
docker-compose exec postgres psql -U postgres -c "ALTER SYSTEM SET log_statement = 'all';"
docker-compose exec postgres psql -U postgres -c "SELECT pg_reload_conf();"
```

### Rollback Procedure

If deployment fails, the automatic rollback will trigger. For manual rollback:

```bash
# Stop current containers
docker-compose down

# Pull previous image version
docker pull ghcr.io/your-username/yol-benicio-api:previous-tag

# Update docker-compose.yml with previous tag
# Start containers
docker-compose up -d

# Restore database from backup if needed
docker-compose exec -T postgres psql -U postgres -d postgres < latest_backup.sql
```

## 📞 Support

For deployment issues:
1. Check application logs: `docker-compose logs app`
2. Run health check: `docker-compose exec app node ace healthcheck`
3. Verify environment variables: `docker-compose exec app env`
4. Check system resources: `htop`, `df -h`, `free -h`

## 📈 Scaling

For increased traffic:

1. **Horizontal Scaling**
```bash
# Scale application containers
docker-compose up -d --scale app=3
```

2. **Database Optimization**
```bash
# Tune PostgreSQL settings in docker-compose.yml
# Add connection pooling
# Consider read replicas
```

3. **Caching**
```bash
# Implement Redis caching strategies
# Add CDN for static assets
# Configure HTTP caching headers
```

---

## 🎯 Quick Commands Reference

```bash
# Deploy latest version
./scripts/deploy.sh

# View logs
docker-compose logs -f app

# Health check
curl http://localhost:3334/health

# Database migration
docker-compose exec app node ace migration:run

# Backup database
docker-compose exec postgres pg_dump -U postgres postgres > backup.sql

# Restart services
docker-compose restart

# Update and deploy
git pull origin master && docker-compose up -d --build
```