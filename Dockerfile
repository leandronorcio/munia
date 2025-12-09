# -------------------------
# Build Stage
# -------------------------
FROM node:20 AS builder

WORKDIR /app

# Disable type checking during Next.js build
ENV NEXT_DISABLE_TYPE_CHECKING=1

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy entire project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js (TS errors will be skipped automatically)
RUN npm run build


# Production Stage

FROM node:20

WORKDIR /app

# Copy build output + dependencies + prisma client
COPY --from=builder /app ./

# Expose port for hosting
EXPOSE 3002

# Start Next.js production server
CMD ["npm", "start", "--", "--hostname", "0.0.0.0", "--port", "3002"]
