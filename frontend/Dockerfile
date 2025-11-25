# -----------------------
# 1. Build Frontend
# -----------------------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# -----------------------
# 2. Serve with NGINX
# -----------------------
FROM nginx:alpine

# Copiar el build
COPY --from=build /app/build /usr/share/nginx/html

# Crear env-config.js con valor por defecto
RUN echo "window._env_ = { REACT_APP_APIURL: 'http://localhost:8085' };" > /usr/share/nginx/html/env-config.js

EXPOSE 80

# Reemplazar la URL en tiempo de ejecución
CMD sed -i "s|http://localhost:8085|$REACT_APP_APIURL|g" /usr/share/nginx/html/env-config.js \
    && nginx -g "daemon off;"