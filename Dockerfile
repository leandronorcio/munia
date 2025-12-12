# =====================
# Build Stage
# =====================
FROM node:20 AS builder

WORKDIR /app

# Disable type checking for faster build
ENV NEXT_DISABLE_TYPE_CHECKING=1

# Copy only package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# =====================
# Production Stage
# =====================
FROM node:20 AS production

WORKDIR /app

# Copy built app and node_modules from builder
COPY --from=builder /app ./

# Expose the port
EXPOSE 3002

# Run Next.js in production mode
CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3002"]
