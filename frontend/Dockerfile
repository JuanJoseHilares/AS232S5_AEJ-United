# Etapa 1: Build
FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Recibir variable de build
ARG REACT_APP_APIURL
ENV REACT_APP_APIURL=$REACT_APP_APIURL
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]