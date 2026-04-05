#!/bin/bash
# OpenClaw Backup Script
# Run: ./backup.sh or add to crontab: 0 3 * * * /opt/openclaw/backup.sh

set -e

INSTALL_DIR="/opt/openclaw"
BACKUP_DIR="$INSTALL_DIR/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Starting backup at $(date)${NC}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup name
BACKUP_NAME="openclaw-backup-$DATE.tar.gz"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo "Creating backup: $BACKUP_NAME"

# Create archive
cd "$INSTALL_DIR"
tar -czf "$BACKUP_PATH" \
    data/ \
    .env \
    docker-compose.yml \
    --exclude='data/postgres/*' \
    --exclude='data/redis/*' 2>/dev/null || true

# Database backup
echo "Backing up PostgreSQL..."
docker exec openclaw-postgres pg_dump -U openclaw openclaw > "$BACKUP_DIR/db-$DATE.sql" 2>/dev/null || echo "Warning: Could not backup database"

# Check backup size
BACKUP_SIZE=$(du -h "$BACKUP_PATH" 2>/dev/null | cut -f1)
echo -e "${GREEN}Backup created: $BACKUP_SIZE${NC}"

# Cleanup old backups
echo "Cleaning up old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "openclaw-backup-*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "db-*.sql" -mtime +$RETENTION_DAYS -delete

# List remaining backups
echo "Available backups:"
ls -lh "$BACKUP_DIR"

echo -e "${GREEN}Backup completed at $(date)${NC}"
