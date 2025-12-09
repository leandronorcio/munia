# build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production 
FROM node:20
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3002
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3002"]
