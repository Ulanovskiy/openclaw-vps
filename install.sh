#!/bin/bash
# OpenClaw VPS Full Deployment
# Repository: github.com/ulanevg/openclaw-vps
# Includes: PostgreSQL, Redis, Gateway, Web UI, SSL

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC}     ${GREEN}OpenClaw VPS Full Deployment${NC}                ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}     ${YELLOW}https://ai.ulanevg.ru${NC}                       ${BLUE}║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# Check root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Run as root: sudo bash install.sh${NC}"
    exit 1
fi

INSTALL_DIR="/opt/openclaw"
DOMAIN="ai.ulanevg.ru"
EMAIL="admin@ulanevg.ru"
REPO="https://raw.githubusercontent.com/ulanevg/openclaw-vps/main"

echo -e "${YELLOW}[1/12] Updating system...${NC}"
apt-get update -y > /dev/null 2>&1
apt-get install -y curl wget git nginx certbot python3-certbot-nginx ufw fail2ban openssl > /dev/null 2>&1
echo -e "${GREEN}✓ System updated${NC}"

echo -e "${YELLOW}[2/12] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh > /dev/null 2>&1
    systemctl enable docker > /dev/null 2>&1
    systemctl start docker
fi

if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose > /dev/null 2>&1
    chmod +x /usr/local/bin/docker-compose
fi
echo -e "${GREEN}✓ Docker installed${NC}"

echo -e "${YELLOW}[3/12] Creating directories...${NC}"
mkdir -p $INSTALL_DIR/{data/{postgres,redis,openclaw/.openclaw},backups,scripts}
cd $INSTALL_DIR
echo -e "${GREEN}✓ Directories created${NC}"

echo -e "${YELLOW}[4/12] Downloading configuration files...${NC}"
curl -fsSL $REPO/docker-compose.yml -o docker-compose.yml
curl -fsSL $REPO/.env.example -o .env.example
curl -fsSL $REPO/nginx.conf -o nginx.conf
curl -fsSL $REPO/backup.sh -o backup.sh
curl -fsSL $REPO/scripts/start.sh -o scripts/start.sh
curl -fsSL $REPO/scripts/stop.sh -o scripts/stop.sh
curl -fsSL $REPO/scripts/logs.sh -o scripts/logs.sh
curl -fsSL $REPO/scripts/status.sh -o scripts/status.sh
curl -fsSL $REPO/scripts/update.sh -o scripts/update.sh
chmod +x *.sh scripts/*.sh
echo -e "${GREEN}✓ Files downloaded${NC}"

echo -e "${YELLOW}[5/12] Downloading Web UI...${NC}"
mkdir -p web
curl -fsSL $REPO/web/package.json -o web/package.json
curl -fsSL $REPO/web/Dockerfile -o web/Dockerfile
curl -fsSL $REPO/web/vite.config.ts -o web/vite.config.ts
curl -fsSL $REPO/web/tsconfig.json -o web/tsconfig.json
curl -fsSL $REPO/web/tsconfig.node.json -o web/tsconfig.node.json
curl -fsSL $REPO/web/index.html -o web/index.html
mkdir -p web/src/{components,pages,stores,types,utils}
curl -fsSL $REPO/web/src/main.tsx -o web/src/main.tsx
curl -fsSL $REPO/web/src/App.tsx -o web/src/App.tsx
curl -fsSL $REPO/web/src/styles.css -o web/src/styles.css
curl -fsSL $REPO/web/src/components/Layout.tsx -o web/src/components/Layout.tsx
curl -fsSL $REPO/web/src/pages/Dashboard.tsx -o web/src/pages/Dashboard.tsx
curl -fsSL $REPO/web/src/pages/Sessions.tsx -o web/src/pages/Sessions.tsx
curl -fsSL $REPO/web/src/pages/Memory.tsx -o web/src/pages/Memory.tsx
curl -fsSL $REPO/web/src/pages/Files.tsx -o web/src/pages/Files.tsx
curl -fsSL $REPO/web/src/pages/Settings.tsx -o web/src/pages/Settings.tsx
echo -e "${GREEN}✓ Web UI downloaded${NC}"

echo -e "${YELLOW}[6/12] Generating secure passwords...${NC}"
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-24)
REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-24)
JWT_SECRET=$(openssl rand -base64 48)

cat > .env << EOF
# OpenClaw VPS Configuration
DOMAIN=$DOMAIN
EMAIL=$EMAIL
TZ=Europe/Moscow

# Database
DB_PASSWORD=$DB_PASSWORD
REDIS_PASSWORD=$REDIS_PASSWORD
JWT_SECRET=$JWT_SECRET

# Paths
INSTALL_DIR=$INSTALL_DIR
EOF

chmod 600 .env
echo -e "${GREEN}✓ Configuration created${NC}"

echo -e "${YELLOW}[7/12] Setting up Nginx...${NC}"
cp nginx.conf /etc/nginx/sites-available/openclaw
ln -sf /etc/nginx/sites-available/openclaw /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t > /dev/null 2>&1
systemctl reload nginx
echo -e "${GREEN}✓ Nginx configured${NC}"

echo -e "${YELLOW}[8/12] Setting up SSL certificate...${NC}"
mkdir -p /var/www/certbot
certbot --nginx -d $DOMAIN --agree-tos --no-eff-email -m $EMAIL --non-interactive --quiet 2>/dev/null || {
    echo -e "${YELLOW}⚠ SSL will be configured on first successful Nginx start${NC}"
}

echo -e "${YELLOW}[9/12] Setting up auto-renewal...${NC}"
(crontab -l 2>/dev/null | grep -v certbot; echo "0 12 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx'") | crontab -
echo -e "${GREEN}✓ Auto-renewal configured${NC}"

echo -e "${YELLOW}[10/12] Configuring firewall...${NC}"
ufw default deny incoming > /dev/null 2>&1
ufw default allow outgoing > /dev/null 2>&1
ufw allow 22/tcp > /dev/null 2>&1
ufw allow 80/tcp > /dev/null 2>&1
ufw allow 443/tcp > /dev/null 2>&1
ufw --force enable > /dev/null 2>&1
systemctl enable fail2ban > /dev/null 2>&1
systemctl start fail2ban
echo -e "${GREEN}✓ Security configured${NC}"

echo -e "${YELLOW}[11/12] Building and starting services...${NC}"
cd $INSTALL_DIR
docker-compose build web > /dev/null 2>&1 || echo "Web UI will be built on first start"
docker-compose up -d
echo -e "${GREEN}✓ Services started${NC}"

echo -e "${YELLOW}[12/12] Setting up systemd service...${NC}"
cat > /etc/systemd/system/openclaw.service << EOF
[Unit]
Description=OpenClaw AI Assistant
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable openclaw > /dev/null 2>&1
echo -e "${GREEN}✓ Auto-start enabled${NC}"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}     ${YELLOW}🎉 Installation Complete!${NC}                  ${GREEN}║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 Web UI:${NC} https://$DOMAIN"
echo -e "${BLUE}📁 Path:${NC} $INSTALL_DIR"
echo -e "${BLUE}🔐 Config:${NC} $INSTALL_DIR/.env"
echo ""
echo -e "${YELLOW}🚀 Quick Commands:${NC}"
echo "  cd $INSTALL_DIR"
echo "  ./scripts/start.sh    # Start services"
echo "  ./scripts/stop.sh     # Stop services"
echo "  ./scripts/logs.sh     # View logs"
echo "  ./scripts/status.sh   # Check status"
echo "  ./scripts/update.sh   # Update to latest"
echo "  ./backup.sh           # Create backup"
echo ""
echo -e "${YELLOW}⚠ Next Steps:${NC}"
echo "1. Copy workspace: scp -r ~/.openclaw/workspace/* root@$DOMAIN:$INSTALL_DIR/data/openclaw/"
echo "2. Check logs: ./scripts/logs.sh"
echo "3. Open: https://$DOMAIN"
echo ""
echo -e "${BLUE}Documentation:${NC} https://github.com/ulanovskiy/openclaw-vps"
"
