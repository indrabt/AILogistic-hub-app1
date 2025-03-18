#!/bin/bash
set -e

# Wait for TimescaleDB to be ready
echo "Waiting for TimescaleDB to be ready..."
until PGPASSWORD=${POSTGRES_PASSWORD:-passwordToChange} psql -h timescaledb -U ${POSTGRES_USER:-ailogistics} -d ${POSTGRES_DB:-ai_logistics_hub} -c '\q'; do
  >&2 echo "TimescaleDB is unavailable - sleeping"
  sleep 2
done

>&2 echo "TimescaleDB is up - continuing"

# Run any database migrations if needed
# npm run migrate

# Start the application
exec "$@"