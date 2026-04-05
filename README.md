# OpenClaw VPS — Full Stack Deployment

Complete OpenClaw deployment on Ubuntu 24.04 with Web UI, PostgreSQL, Redis, SSL, and security hardening.

## 🎯 What's Included

```
┌─────────────────────────────────────────────────────────────┐
│                    https://ai.ulanevg.ru                     │
│                        Nginx + SSL                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
  ┌────▼────┐    ┌────▼────┐    ┌─────▼──────┐
  │ Web UI  │    │ Gateway │    │  Workspace │
  │ (React) │◄──►│(Node.js)│    │   Volume   │
  │ :3000   │    │ :18789  │    │            │
  └─────────┘    └────┬────┘    └────────────┘
                      │
       ┌──────────────┼──────────────┐
       │              │              │
  ┌────▼─────┐   ┌────▼─────┐   ┌────▼─────┐
  │PostgreSQL│   │  Redis   │   │  Files   │
  │  :5432   │   │  :6379   │   │  /data   │
  └──────────┘   └──────────┘   └──────────┘
```

## 🚀 One-Command Installation

```bash
ssh root@144.31.26.252
curl -fsSL https://raw.githubusercontent.com/ulanovskiy/openclaw-vps/master/install.sh | bash
```

## 📋 Requirements

- **OS:** Ubuntu 24.04 LTS
- **CPU:** 2 vCPU
- **RAM:** 4 GB
- **Disk:** 60 GB SSD
- **Domain:** ai.ulanevg.ru (A-record → 144.31.26.252)
- **Ports:** 22 (SSH), 80 (HTTP), 443 (HTTPS)

## 📁 Repository Structure

```
openclaw-vps/
├── install.sh              # Main installation script
├── docker-compose.yml      # Services orchestration
├── .env.example           # Configuration template
├── nginx.conf             # Nginx + SSL configuration
├── backup.sh              # Backup script
├── README.md              # This file
│
├── scripts/               # Management commands
│   ├── start.sh          # Start all services
│   ├── stop.sh           # Stop all services
│   ├── restart.sh        # Restart services
│   ├── logs.sh           # View logs
│   ├── status.sh         # Check status
│   └── update.sh         # Update to latest
│
└── web/                   # React Web UI
    ├── package.json
    ├── Dockerfile
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── styles.css
        ├── components/
        │   └── Layout.tsx
        └── pages/
            ├── Dashboard.tsx
            ├── Sessions.tsx
            ├── Memory.tsx
            ├── Files.tsx
            └── Settings.tsx
```

## 🔧 Management Commands

```bash
cd /opt/openclaw

# Lifecycle
./scripts/start.sh      # Start all services
./scripts/stop.sh       # Stop all services
./scripts/restart.sh    # Restart services

# Monitoring
./scripts/logs.sh       # View logs (Ctrl+C to exit)
./scripts/status.sh     # Container status & resources
docker-compose ps       # Docker status

# Updates
./scripts/update.sh     # Pull latest images & rebuild
./backup.sh            # Create backup

# Direct Docker
docker-compose up -d    # Start
docker-compose down     # Stop
docker-compose logs -f  # Logs
docker stats            # Resource usage
```

## 💾 Migration from Local

```bash
# From your local machine:
scp -r ~/.openclaw/workspace/* root@ai.ulanevg.ru:/opt/openclaw/data/openclaw/
scp ~/.openclaw/openclaw.json root@ai.ulanevg.ru:/opt/openclaw/data/openclaw/.openclaw/

# On VPS:
ssh root@ai.ulanevg.ru "cd /opt/openclaw && docker-compose restart"
```

## 🔐 Security Features

- **SSL/TLS:** Let's Encrypt certificates (auto-renewal)
- **Firewall:** UFW (only 22, 80, 443 open)
- **Fail2Ban:** Protection against brute-force
- **Docker:** Isolated containers
- **Secrets:** Auto-generated strong passwords

## 🌐 Web UI Features

| Page | Description |
|------|-------------|
| **Dashboard** | System stats, active sessions, quick actions |
| **Sessions** | Chat history, search, filters |
| **Memory** | Memory files (SOUL.md, MEMORY.md, daily notes) |
| **Files** | Workspace files, upload/download |
| **Settings** | API keys, backup, security settings |

## 📝 Configuration

Edit `/opt/openclaw/.env`:

```bash
DOMAIN=ai.ulanevg.ru
EMAIL=admin@ulanevg.ru
TZ=Europe/Moscow

# Database (auto-generated)
DB_PASSWORD=xxx
REDIS_PASSWORD=xxx
JWT_SECRET=xxx
```

## 💾 Backup & Restore

```bash
# Create backup
cd /opt/openclaw
./backup.sh

# Backup includes:
# - workspace files
# - database dump
# - configuration

# Restore from backup:
tar -xzf backups/openclaw-backup-YYYYMMDD.tar.gz
docker exec -i openclaw-postgres psql -U openclaw < backups/db-YYYYMMDD.sql
```

## 🆘 Troubleshooting

```bash
# Check logs
./scripts/logs.sh

# Restart everything
./scripts/restart.sh

# Check disk space
df -h

# Check memory
free -h

# Rebuild Web UI
docker-compose build web
docker-compose up -d

# Reset database (WARNING: destroys data!)
docker-compose down -v
docker-compose up -d
```

## 🔄 Update OpenClaw

```bash
# Automated update
./scripts/update.sh

# Manual update
cd /opt/openclaw
docker-compose pull
docker-compose build web
docker-compose up -d
```

## 📊 Resource Usage

| Component | RAM | CPU | Disk |
|-----------|-----|-----|------|
| PostgreSQL | ~200MB | Low | ~1GB |
| Redis | ~50MB | Low | ~100MB |
| Gateway | ~300MB | Medium | ~500MB |
| Web UI | ~100MB | Low | ~100MB |
| **Total** | **~650MB** | **Low** | **~2GB** |

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/ulanevg/openclaw-vps.git
cd openclaw-vps

# Modify Web UI
cd web
npm install
npm run dev

# Build for production
npm run build
```

## 📄 License

MIT License — use freely.

## 🔗 Links

- **Web UI:** https://ai.ulanevg.ru
- **Repository:** https://github.com/ulanovskiy/openclaw-vps
- **Documentation:** See README.md

---

Created by J.A.R.V.I.S. for Евгений | ai.ulanevg.ru
u
