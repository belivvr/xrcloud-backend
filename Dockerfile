FROM node:18

RUN apt-get update && apt-get install -y bash bash-completion

RUN sed -i 's|/bin/sh|/bin/bash|g' /etc/passwd

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "prod" ]