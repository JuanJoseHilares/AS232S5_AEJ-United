# Etapa 1: Build con Node 20
FROM node:20-alpine AS build
WORKDIR /app

# Copiar package.json y package-lock.json e instalar dependencias
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar el resto de la app
COPY . .

# Recibir variable de build
ARG REACT_APP_APIURL
ENV REACT_APP_APIURL=$REACT_APP_APIURL

# Asegurar permisos y construir
RUN chmod -R 755 /app/node_modules/.bin && npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]