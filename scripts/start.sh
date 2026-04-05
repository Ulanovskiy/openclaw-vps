#!/bin/bash
# Start OpenClaw services
cd /opt/openclaw
docker-compose up -d
echo -e "\033[0;32m✓ OpenClaw started\033[0m"
echo "Web UI: https://ai.ulanevg.ru"
