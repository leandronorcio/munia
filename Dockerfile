FROM node:20

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

CMD [ "npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3002" ]