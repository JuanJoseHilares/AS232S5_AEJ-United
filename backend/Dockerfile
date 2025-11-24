# ---------- Stage 1: Build con Maven ----------
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copiar pom.xml y descargar dependencias (cache eficiente)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar el resto del código fuente
COPY src ./src

# Compilar y empaquetar (sin tests)
RUN mvn clean package -Dmaven.test.skip=true

# ---------- Stage 2: Imagen final ligera ----------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiar el jar desde el builder
COPY --from=builder /app/target/*.jar app.jar

# Exponer el puerto de Spring Boot
EXPOSE 8085

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]