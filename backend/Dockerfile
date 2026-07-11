# Imagen del Backend_API (Node.js + Express + Mongoose).

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Carpeta donde `multer` (ver `middleware/upload.js`) guarda los logos de equipos subidos (`uploads/teams/`).

RUN mkdir -p uploads/teams

EXPOSE 4000

CMD ["npm", "start"]
