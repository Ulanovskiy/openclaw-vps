#!/bin/bash
# Check status
cd /opt/openclaw
echo "=== Container Status ==="
docker-compose ps
echo ""
echo "=== Resource Usage ==="
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
