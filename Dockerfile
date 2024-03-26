FROM node:18 AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist /app/dist

EXPOSE 3000

CMD ["npm", "run", "prod"]
