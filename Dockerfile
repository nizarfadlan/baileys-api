FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json .

# Install git
RUN apk add --no-cache git

RUN npm install --quiet

RUN npx prisma migrate

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
