# Etapa 1: Build con Node
FROM node:18 AS build
WORKDIR /app

# Copiar package.json y package-lock.json e instalar dependencias
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copiar el resto de la app y establecer variable de entorno
COPY . .
ARG REACT_APP_APIURL
ENV REACT_APP_APIURL=$REACT_APP_APIURL

# Build de React
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]