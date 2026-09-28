#!/bin/sh
set -e

echo "==> Applying database migrations..."
cd /app/backend
python manage.py migrate --noinput

echo "==> Starting services (Gunicorn + Nginx)..."
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/cpam.conf
