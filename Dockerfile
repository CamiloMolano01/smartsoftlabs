# Usa una imagen base de Node.js
FROM node:18.17.1

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Define el comando para iniciar tu aplicación
CMD ["npm", "start"]