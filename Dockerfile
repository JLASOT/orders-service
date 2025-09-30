
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
