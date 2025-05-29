# Backend Deployment Guide (Railway & MongoDB Atlas)

## 1. Railway Deployment

- Go to [Railway](https://railway.app/)
- Create a new project and link your GitHub repo
- Set environment variables:
  - `MONGODB_URI` (from MongoDB Atlas)
  - `NODE_ENV=production`
- Healthcheck endpoint: `/health`
- Start command: `npm start`

## 2. MongoDB Atlas Setup

- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Create a free cluster
- Whitelist Railway's IP or set to allow all IPs (for dev)
- Create a database user and get the connection string
- Use this string as `MONGODB_URI` in Railway

## 3. Best Practices

- Never commit `.env` files
- Use `.env.example` for reference
- Use Railway variables for secrets
- Monitor logs in Railway dashboard

## 4. Troubleshooting

- Check Railway build and deploy logs
- Ensure all environment variables are set
- For CORS issues, update backend CORS config
- For database connection errors, check Atlas network access and user credentials
