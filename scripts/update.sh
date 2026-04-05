#!/bin/bash
# Update OpenClaw to latest
cd /opt/openclaw
echo "Pulling latest images..."
docker-compose pull
echo "Rebuilding Web UI..."
docker-compose build web
echo "Restarting services..."
docker-compose up -d
echo -e "\033[0;32m✓ Update complete\033[0m"
