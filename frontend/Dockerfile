# Imagen base
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar solo package.json y package-lock.json primero
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el resto del frontend
COPY . .

# Construir app
RUN npm run build

# Servir con nginx
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html