# Build stage
FROM node:20 AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with ML capabilities
FROM node:20-slim

# Install Python and required ML libraries
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    libpq-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install ML and data processing libraries
RUN pip3 install --no-cache-dir \
    numpy \
    pandas \
    scikit-learn \
    matplotlib \
    psycopg2-binary \
    sqlalchemy \
    joblib \
    pyarrow \
    fastparquet \
    xgboost \
    lightgbm \
    statsmodels

# Set working directory
WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared

# Create directories for logs and ML models
RUN mkdir -p /app/logs /app/ml_models

# Expose port
EXPOSE 5000

# Set environment variable
ENV NODE_ENV=production

# Start script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Start the application
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/server/index.js"]