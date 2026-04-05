#!/bin/bash
# Restart OpenClaw services
cd /opt/openclaw
docker-compose restart
echo -e "\033[0;32m✓ OpenClaw restarted\033[0m"
