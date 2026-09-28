# ──────────────────────────────────────────────
# Stage 1 : build
# ──────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# Dépendances système minimales
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# ──────────────────────────────────────────────
# Stage 2 : runtime
# ──────────────────────────────────────────────
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Dépendances runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copier les packages installés depuis le stage builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copier le code source
COPY . .

# Créer les répertoires pour les fichiers statiques et médias
RUN mkdir -p /app/staticfiles /app/media

# Collecter les fichiers statiques
RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

# Script de démarrage
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn CPAM.wsgi:application --bind 0.0.0.0:8000 --workers 4 --timeout 120"]
