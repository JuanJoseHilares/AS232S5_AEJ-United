# Etapa 1: Build con Node 18
FROM node:18 AS build

# Directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json e instalar dependencias
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copiar todo el proyecto
COPY . .

# Recibir variable de build desde Docker build-args
ARG REACT_APP_APIURL
ENV REACT_APP_APIURL=$REACT_APP_APIURL

# Generar build de producción
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar build desde etapa anterior
COPY --from=build /app/build /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]