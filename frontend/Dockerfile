FROM node:20-alpine AS build

WORKDIR /app

# 1. Copia solo los package.json primero
COPY package*.json ./

# 2. Instala dependencias
RUN npm install

# 3. Copia el resto del código
COPY . .

# 4. Arregla permisos del binario react-scripts
RUN chmod +x node_modules/.bin/react-scripts

# 5. Construye
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