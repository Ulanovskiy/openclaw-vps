#!/bin/bash
# Stop OpenClaw services
cd /opt/openclaw
docker-compose down
echo -e "\033[0;31m✓ OpenClaw stopped\033[0m"
