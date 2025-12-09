# Build Stage
FROM node:20 AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js (skip TS errors temporarily)
RUN npm run build --skipLibCheck

# Production Stage
FROM node:20
WORKDIR /app

# Copy built app + node_modules
COPY --from=builder /app ./

# Expose port
EXPOSE 3002

# Start Next.js production server
CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3002"]
