# ================================================================
#  CPAM — Dockerfile (conteneur unique pour Coolify)
#  Frontend React + Backend Django dans le même conteneur
#  Port exposé : 80
#  Nginx sert le React et proxifie /api/ vers Gunicorn interne
# ================================================================

# ── Stage 1 : Build du frontend React (Vite) ─────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --frozen-lockfile

COPY frontend/ .

# Frontend et backend sur le même domaine → /api suffit
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ── Stage 2 : Installation des dépendances Python ────────────────
FROM python:3.11-slim AS python-builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

COPY CPAM/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ── Stage 3 : Image finale ────────────────────────────────────────
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

WORKDIR /app

# Outils système : Nginx + Supervisord
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx supervisor libpq5 && rm -rf /var/lib/apt/lists/*

# Packages Python depuis le stage builder
COPY --from=python-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=python-builder /usr/local/bin /usr/local/bin

# Code source Django
COPY CPAM/ ./backend/

# Build React compilé
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Dossiers pour médias et fichiers statiques
RUN mkdir -p /app/backend/staticfiles /app/backend/media

# ── Config Nginx ──────────────────────────────────────────────────
RUN cat > /etc/nginx/sites-enabled/default << 'EOF'
server {
    listen 80;
    server_name _;

    # Fichiers React
    root /app/frontend/dist;
    index index.html;

    # Assets buildés par Vite (noms hashés) → cache 1 an
    location ~* \.(js|css|woff2?|ttf|eot|svg|ico|png|jpg|jpeg|gif)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # API Django → Gunicorn interne
    location /api/ {
        proxy_pass         http://127.0.0.1:8000;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
        client_max_body_size 20M;
    }

    # Admin Django
    location /admin/ {
        proxy_pass         http://127.0.0.1:8000;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        client_max_body_size 20M;
    }

    # Fichiers statiques Django (admin, DRF…)
    location /static/ {
        alias /app/backend/staticfiles/;
        expires 30d;
    }

    # Fichiers médias uploadés
    location /media/ {
        alias /app/backend/media/;
    }

    # Tout le reste → React SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# ── Config Supervisord (gère Gunicorn + Nginx) ────────────────────
RUN cat > /etc/supervisor/conf.d/cpam.conf << 'EOF'
[supervisord]
nodaemon=true
logfile=/dev/stdout
logfile_maxbytes=0

[program:gunicorn]
command=gunicorn CPAM.wsgi:application --bind 127.0.0.1:8000 --workers 4 --timeout 120
directory=/app/backend
autostart=true
autorestart=true
priority=10
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:nginx]
command=/usr/sbin/nginx -g "daemon off;"
autostart=true
autorestart=true
priority=20
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOF

# ── Collecte des fichiers statiques Django ────────────────────────
RUN cd /app/backend && python manage.py collectstatic --noinput || true

# ── Script de démarrage ───────────────────────────────────────────
RUN printf '#!/bin/sh\nset -e\necho "==> Migrations..."\ncd /app/backend && python manage.py migrate --noinput\necho "==> Demarrage..."\nexec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/cpam.conf\n' > /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
