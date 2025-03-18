# AI Logistics Hub - Docker Deployment Guide

This guide explains how to deploy the AI Logistics Hub application using Docker and TimescaleDB for ML-optimized data storage and processing.

## Prerequisites

- Docker and Docker Compose installed on your system
- Basic understanding of Docker containers and PostgreSQL
- 4GB RAM minimum (8GB+ recommended for ML workloads)

## Deployment Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-logistics-hub
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file to update the credentials and API keys as needed.

### 3. Build and Start the Containers

```bash
docker-compose up -d
```

This will start:
- The Node.js application with ML capabilities
- TimescaleDB database (optimized for time-series data)
- PgAdmin web interface for database management

### 4. Access the Application

- Web Application: http://localhost:5000
- PgAdmin: http://localhost:5050
  - Login with the email and password specified in your .env file

### 5. Monitoring and Logs

View application logs:

```bash
docker-compose logs -f app
```

View database logs:

```bash
docker-compose logs -f timescaledb
```

## Database Structure

The database is optimized for machine learning workloads with:

- Hypertables for efficient time-series data storage and querying
- Specialized indexes for ML feature access patterns
- Optimized table structure for analytical queries
- Built-in anomaly detection capabilities
- Continuous aggregates for real-time analytics

## ML Capabilities

The Docker container comes with pre-installed Python libraries for ML:

- NumPy, Pandas for data manipulation
- Scikit-learn for ML algorithms
- XGBoost and LightGBM for gradient boosting
- Matplotlib for visualization
- SQLAlchemy for database interaction
- PyArrow and Fastparquet for columnar data processing

## Customizing ML Models

To add custom ML models:

1. Add your Python scripts to the `/ml_models` directory
2. Update the application to use your models
3. Rebuild the container with `docker-compose build app`

## Production Considerations

For production deployment:

- Set strong passwords in the .env file
- Enable TimescaleDB backups
- Consider using Docker Swarm or Kubernetes for container orchestration
- Set up monitoring with Prometheus and Grafana
- Configure proper SSL/TLS certificates for secure access

## Scaling

The application can be scaled by:

- Increasing TimescaleDB resources for larger datasets
- Adding read replicas for the database
- Setting up a load balancer for multiple application instances
- Configuring a distributed cache like Redis for session management

## Troubleshooting

If you encounter issues:

- Check the application logs
- Verify database connectivity
- Ensure all environment variables are set correctly
- Check that ports 5000 and 5432 are not being used by other applications