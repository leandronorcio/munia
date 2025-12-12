
# Build Stage
FROM node:20 AS builder

WORKDIR /app

# Disable type checking during Next.js build
ENV NEXT_DISABLE_TYPE_CHECKING=1

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate


RUN npm run build


# Production Stage
FROM node:20

WORKDIR /app


COPY --from=builder /app ./

EXPOSE 3002

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3002"]
