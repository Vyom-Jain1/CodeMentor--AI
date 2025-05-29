# Database Deployment Guide (Free Options)

## 1. MongoDB Atlas (Recommended)

- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Create a free cluster (Shared, 512MB)
- Whitelist your IP or allow all IPs (for dev)
- Create a database user and get the connection string
- Use as `MONGODB_URI` in your backend
- Limit: 500 connections

## 2. PlanetScale (MySQL)

- Go to [PlanetScale](https://planetscale.com/)
- Create a free database (5GB)
- Connect using Prisma or MySQL client
- Use connection string in your backend (if using MySQL)
- Best for relational data

## 3. Supabase (PostgreSQL)

- Go to [Supabase](https://supabase.com/)
- Create a free project (500MB)
- Use REST API or Postgres connection string
- Built-in authentication and real-time features

## 4. Best Practices

- Never commit database credentials
- Use environment variables for all secrets
- Monitor usage and upgrade if needed
