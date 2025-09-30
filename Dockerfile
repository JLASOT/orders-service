# # Usa una imagen oficial de Node.js como base
# FROM node:18

# # Establece el directorio de trabajo dentro del contenedor
# WORKDIR /app

# # Copia los archivos de dependencias
# COPY package*.json ./

# # Instala las dependencias
# RUN npm install

# # Copia el resto del código fuente
# COPY . .

# # Expone el puerto que usa tu app (ajústalo si es diferente)
# EXPOSE 3000

# # Comando para iniciar la app
# CMD ["node", "index.js"]
# Etapa 1: build
FROM node:18 AS build

WORKDIR /app

# Copiamos solo los archivos de dependencias primero
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Etapa 2: producción
FROM node:18-alpine

WORKDIR /app

# Copiamos las dependencias y el código desde la etapa build
COPY --from=build /app ./

# Exponemos el puerto
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "index.js"]
