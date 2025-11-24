# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos los package.json explícitamente desde el contexto
COPY ./package.json ./package-lock.json ./
RUN npm install --legacy-peer-deps

# Copiamos todo lo demás
COPY ./ ./

# Variable de entorno
ARG REACT_APP_APIURL
ENV REACT_APP_APIURL=$REACT_APP_APIURL

RUN npm run build

# Stage 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]