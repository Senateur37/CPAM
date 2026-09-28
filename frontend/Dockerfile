# ──────────────────────────────────────────────
# Stage 1 : build React (Vite)
# ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile

COPY . .

# Les variables d'env Vite doivent être connues au build
ARG VITE_API_BASE_URL=http://localhost:8000/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ──────────────────────────────────────────────
# Stage 2 : Nginx pour servir le build
# ──────────────────────────────────────────────
FROM nginx:alpine

# Supprimer la config Nginx par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier notre config Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
