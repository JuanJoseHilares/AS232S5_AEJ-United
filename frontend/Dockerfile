# Stage 1: Build
FROM node:20.6-slim AS build
WORKDIR /app

# Declarar el ARG y pasarlo como ENV
ARG REACT_APP_APIURL
ENV REACT_APP_APIURL=$REACT_APP_APIURL

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar todo el proyecto
COPY . .

# Construir la aplicación React
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]