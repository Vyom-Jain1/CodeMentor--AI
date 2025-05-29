# Frontend Deployment Guide (Vercel & Netlify)

## 1. Vercel Deployment

- Go to [Vercel](https://vercel.com/)
- Import your frontend (client) repo or subfolder
- Set environment variable:
  - `REACT_APP_API_URL` (your backend URL)
- Build command: `npm run build`
- Output directory: `build`

## 2. Netlify Deployment

- Go to [Netlify](https://netlify.com/)
- Import your frontend repo
- Set environment variable:
  - `REACT_APP_API_URL` (your backend URL)
- Build command: `npm run build`
- Publish directory: `build`

## 3. Best Practices

- Use environment variables for API URLs
- Use separate branches for staging/production
- Monitor deploy logs in Vercel/Netlify dashboard

## 4. Troubleshooting

- For CORS issues, update backend CORS config
- For build errors, check logs and ensure all dependencies are installed
