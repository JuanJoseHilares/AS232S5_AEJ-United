FROM node:20-alpine AS build
WORKDIR /app

# Copiar solo package.json y package-lock.json primero
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copiar el resto de la app
COPY . .

ARG REACT_APP_APIURL
ENV REACT_APP_APIURL=$REACT_APP_APIURL

RUN npm run build

# Servir con nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]