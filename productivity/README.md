# Личная продуктивность на VPS

Личная база знаний и управление задачами для Евгения.

## Что здесь

- **Outline** — база знаний (аналог Notion/Confluence)
- **Vikunja** — управление задачами (аналог Todoist/Trello)

## Быстрый старт

```bash
cd /opt/productivity
docker-compose up -d
```

## Настройка доменов

Добавь A-записи:
- `wiki.ai.ulanevg.ru` → IP твоего VPS
- `tasks.ai.ulanevg.ru` → IP твоего VPS

Добавь в `/etc/nginx/sites-available/openclaw` (или создай отдельный конфиг):

```nginx
server {
    listen 80;
    server_name wiki.ai.ulanevg.ru;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}

server {
    listen 80;
    server_name tasks.ai.ulanevg.ru;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://127.0.0.1:3456;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}
```

Получи SSL:
```bash
certbot --nginx -d wiki.ai.ulanevg.ru -d tasks.ai.ulanevg.ru
```

## Настройка Outline

⚠️ **Важно:** Outline требует внешний OAuth-провайдер (Google, Slack, Azure). Встроенной регистрации нет.

### Проще всего: Google OAuth

1. Перейди в [Google Cloud Console](https://console.cloud.google.com/)
2. Создай проект → APIs & Services → Credentials
3. Create Credentials → OAuth client ID → Web application
4. Authorized redirect URI: `https://wiki.ai.ulanevg.ru/auth/google.callback`
5. Скопируй Client ID и Client Secret
6. Добавь в `outline.env`:

```env
GOOGLE_CLIENT_ID=твой_client_id
GOOGLE_CLIENT_SECRET=твой_client_secret
```

7. Перезапусти: `docker-compose restart outline`

### Альтернатива Outline (если OAuth не хочется)

Если настраивать Google OAuth лень — используй **Trilium Next** или **Joplin Server**.
Они работают с обычным логином/паролем из коробки. Могу подготовить compose.

## Настройка Vikunja

1. Открой `https://tasks.ai.ulanevg.ru`
2. Нажми **Register**, создай аккаунт
3. После регистрации отключи новые регистрации для безопасности:
   - Отредактируй `vikunja.env`
   - Установи `VIKUNJA_SERVICE_ENABLEREGISTRATION=0`
   - `docker-compose restart vikunja`

4. Скачай мобильное приложение: [Vikunja Cloud / Self-Hosted](https://vikunja.io/download/)
5. В приложении укажи URL: `https://tasks.ai.ulanevg.ru`

## Полезности для Vikunja

- **Kanban** — для визуализации статуса задач по методологии
- **Gantt** — для планирования внедрения SAFe по неделям
- **Import** — можно импортировать задачи из Todoist/Trello/Microsoft To-Do
- **CalDAV** — синхронизация задач с календарём на телефоне

## Бэкапы

Данные хранятся в Docker volumes. Для бэкапа:

```bash
# Бэкап
mkdir -p /opt/backups/productivity
docker run --rm -v productivity_outline-db:/data -v /opt/backups:/backup alpine tar czf /backup/outline-db-$(date +%F).tar.gz -C /data .
docker run --rm -v productivity_vikunja-db:/data -v /opt/backups:/backup alpine tar czf /backup/vikunja-db-$(date +%F).tar.gz -C /data .
```

## Ресурсы

- Outline: ~300MB RAM + PostgreSQL + Redis + MinIO
- Vikunja: ~100MB RAM + PostgreSQL
- Всего: ~600-800MB RAM в покое
