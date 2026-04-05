#!/bin/bash
# View logs
cd /opt/openclaw
docker-compose logs -f --tail=100
