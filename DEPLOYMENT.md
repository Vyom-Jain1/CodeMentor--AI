# CodeMentor AI Deployment Guide

## 1. Free Database Options

### MongoDB Atlas (Recommended)

- **Features:** 512MB Storage, Shared Cluster, No time limit
- **Setup:**
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
  2. Create a free cluster
  3. Whitelist your IP and create a database user
  4. Get the connection string and set it as `MONGODB_URI` in your backend `.env`
- **Limitations:** Max 500 connections

### PlanetScale (MySQL)

- **Features:** 5GB Storage, Branching, Serverless
- **Setup:**
  1. Go to [PlanetScale](https://planetscale.com/)
  2. Create a database
  3. Connect using Prisma or MySQL client
- **Advantages:** Better for relational data

### Supabase (PostgreSQL)

- **Features:** 500MB Storage, Real-time, Auth included
- **Setup:**
  1. Go to [Supabase](https://supabase.com/)
  2. Create a project
  3. Use the REST API or Postgres connection string
- **Bonus:** Built-in authentication

## 2. Local Development with Docker Compose

- Use the provided `docker-compose.yml` to spin up backend, frontend, and MongoDB locally.
- Run: `docker-compose up --build`

## 3. Railway Deployment (Backend)

- Go to [Railway](https://railway.app/)
- Create a new project and link your GitHub repo
- Set environment variables (`MONGODB_URI`, etc.)
- Use the following `railway.json`:

```json
{
  "build": { "builder": "nixpacks" },
  "deploy": { "startCommand": "npm start", "healthcheckPath": "/health" }
}
```

## 4. Frontend Deployment (Vercel/Netlify)

- Push your frontend (client) to a separate repo or subfolder
- Connect to [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/)
- Set `REACT_APP_API_URL` to your backend URL

## 5. Troubleshooting

- Check logs for errors: `docker-compose logs`
- Ensure all environment variables are set
- For CORS issues, update backend CORS config

## 6. Best Practices

- Never commit `.env` files
- Use `.env.example` for reference
- Use free database tiers for development and small-scale production
