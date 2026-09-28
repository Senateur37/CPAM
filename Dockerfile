# ================================================================
# CPAM — Conteneur unique (Frontend + Backend)
# Optimisé pour Coolify :
#   - Coolify fournit PostgreSQL comme ressource séparée
#   - Coolify (Traefik) gère le domaine et le SSL
#   - Ce conteneur écoute sur le port 80 en interne
# Architecture interne :
#   Nginx (port 80)
#     ├── /         → React (SPA buildée)
#     ├── /api/     → proxy → Gunicorn (localhost:8000)
#     ├── /admin/   → proxy → Gunicorn (localhost:8000)
#     ├── /static/  → fichiers statiques Django
#     └── /media/   → fichiers médias Django
# ================================================================

# ── Stage 1 : Build React (Vite) ────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --frozen-lockfile

COPY frontend/ .

# /api = même domaine → pas besoin d'URL absolue
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ── Stage 2 : Dépendances Python ────────────────────────────────
FROM python:3.11-slim AS python-builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY CPAM/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# ── Stage 3 : Image finale ──────────────────────────────────────
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Runtime : Nginx + Supervisord + libpq
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Packages Python
COPY --from=python-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=python-builder /usr/local/bin /usr/local/bin

# Code Django
COPY CPAM/ ./backend/

# Build React → servi par Nginx
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Répertoires données persistantes
RUN mkdir -p /app/backend/staticfiles /app/backend/media

# Configs
COPY nginx-unified.conf /etc/nginx/sites-enabled/default
COPY supervisord.conf   /etc/supervisor/conf.d/cpam.conf
COPY entrypoint.sh      /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Collecte des fichiers statiques Django
RUN cd /app/backend && python manage.py collectstatic --noinput || true

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
