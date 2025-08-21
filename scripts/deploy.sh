#!/bin/bash

# Production deployment script for Yol Benício API
# Usage: ./scripts/deploy.sh [version]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/root/yol-benicio-api"
COMPOSE_FILE="docker-compose.prod.yml"
IMAGE_TAG=${1:-latest}
BACKUP_DIR="/root/backups"
LOG_FILE="/var/log/yol-deployment.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

# Pre-deployment checks
check_prerequisites() {
    log "🔍 Running pre-deployment checks..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running!"
    fi
    
    # Check if docker-compose is available
    if ! command -v docker-compose &> /dev/null; then
        error "docker-compose is not installed!"
    fi
    
    # Check if project directory exists
    if [ ! -d "$PROJECT_DIR" ]; then
        error "Project directory $PROJECT_DIR does not exist!"
    fi
    
    success "✅ Prerequisites check passed"
}

# Backup current state
backup_current_state() {
    log "📦 Creating backup of current state..."
    
    mkdir -p $BACKUP_DIR
    BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_NAME="yol-backup-$BACKUP_TIMESTAMP"
    
    cd $PROJECT_DIR
    
    # Create database backup
    if docker-compose -f $COMPOSE_FILE ps postgres | grep -q "Up"; then
        log "Creating database backup..."
        docker-compose -f $COMPOSE_FILE exec -T postgres pg_dump -U postgres postgres > "$BACKUP_DIR/$BACKUP_NAME.sql"
        success "✅ Database backup created: $BACKUP_NAME.sql"
    else
        warning "⚠️ PostgreSQL container not running, skipping database backup"
    fi
    
    # Create application files backup
    tar -czf "$BACKUP_DIR/$BACKUP_NAME-files.tar.gz" \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=storage/logs \
        --exclude=storage/tmp \
        .
    
    success "✅ Application backup created: $BACKUP_NAME-files.tar.gz"
}

# Pull latest code
update_code() {
    log "📥 Updating application code..."
    
    cd $PROJECT_DIR
    
    # Stash any local changes
    git stash
    
    # Pull latest changes
    git fetch origin
    git reset --hard origin/master
    
    success "✅ Code updated to latest version"
}

# Pull Docker image
pull_image() {
    log "🐳 Pulling Docker image: $IMAGE_TAG..."
    
    # Login to GitHub Container Registry
    if [ ! -z "$GITHUB_TOKEN" ]; then
        echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_ACTOR" --password-stdin
    fi
    
    docker pull ghcr.io/gabrielmaia/yol-benicio-api:$IMAGE_TAG
    
    success "✅ Docker image pulled successfully"
}

# Deploy application
deploy_application() {
    log "🚀 Deploying application..."
    
    cd $PROJECT_DIR
    
    # Set image tag
    export IMAGE_TAG=$IMAGE_TAG
    
    # Stop current containers
    log "Stopping current containers..."
    docker-compose -f $COMPOSE_FILE down --remove-orphans
    
    # Start new containers
    log "Starting new containers..."
    docker-compose -f $COMPOSE_FILE up -d
    
    # Wait for services to be ready
    log "⏳ Waiting for services to start..."
    sleep 30
    
    success "✅ Application containers started"
}

# Run migrations
run_migrations() {
    log "🔄 Running database migrations..."
    
    cd $PROJECT_DIR
    
    # Wait for database to be ready
    timeout 60s bash -c 'until docker-compose -f '$COMPOSE_FILE' exec -T postgres pg_isready -U postgres; do sleep 2; done'
    
    # Run migrations
    docker-compose -f $COMPOSE_FILE exec -T app node ace migration:run --force
    
    success "✅ Database migrations completed"
}

# Health check
health_check() {
    log "🔍 Running health checks..."
    
    # Check if containers are running
    if ! docker-compose -f $COMPOSE_FILE ps | grep -q "Up"; then
        error "Some containers are not running!"
    fi
    
    # Check application health endpoint
    timeout 60s bash -c 'until curl -f http://localhost:3334/health; do sleep 2; done'
    
    if [ $? -eq 0 ]; then
        success "✅ Application health check passed"
    else
        error "❌ Application health check failed"
    fi
    
    # Check external access
    if curl -f https://benicio.mahina.cloud/health > /dev/null 2>&1; then
        success "✅ External access health check passed"
    else
        warning "⚠️ External access health check failed"
    fi
}

# Cleanup old resources
cleanup() {
    log "🧹 Cleaning up old resources..."
    
    # Remove unused Docker images
    docker image prune -f
    
    # Remove old backups (keep last 5)
    find $BACKUP_DIR -name "yol-backup-*" -type f | sort -r | tail -n +6 | xargs rm -f
    
    success "✅ Cleanup completed"
}

# Rollback function
rollback() {
    error "❌ Deployment failed! Initiating rollback..."
    
    cd $PROJECT_DIR
    
    # Stop current containers
    docker-compose -f $COMPOSE_FILE down
    
    # Get latest backup
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/yol-backup-*.sql 2>/dev/null | head -1)
    
    if [ ! -z "$LATEST_BACKUP" ]; then
        log "🔄 Restoring from backup: $LATEST_BACKUP"
        
        # Start only database
        docker-compose -f $COMPOSE_FILE up -d postgres redis
        sleep 20
        
        # Restore database
        docker-compose -f $COMPOSE_FILE exec -T postgres psql -U postgres -d postgres < "$LATEST_BACKUP"
        
        # Start application with previous image
        docker-compose -f $COMPOSE_FILE up -d
        
        warning "⚠️ Rollback completed. Please investigate the deployment issue."
    else
        error "No backup found for rollback!"
    fi
}

# Main deployment flow
main() {
    log "🚀 Starting deployment of Yol Benício API v$IMAGE_TAG"
    
    # Set trap for error handling
    trap rollback ERR
    
    check_prerequisites
    backup_current_state
    update_code
    pull_image
    deploy_application
    run_migrations
    health_check
    cleanup
    
    success "🎉 Deployment completed successfully!"
    log "Application is running at: https://benicio.mahina.cloud"
}

# Run main function
main "$@"