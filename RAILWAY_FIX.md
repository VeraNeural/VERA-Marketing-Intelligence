# 🚀 VERA Railway Deployment - URGENT FIX

## Current Issue
Railway deployment failing because environment variables are not set in Railway dashboard.

## Required Railway Environment Variables

Set these in your Railway project dashboard (railway.app → your project → Variables):

```
VERA_API_URL=https://qwen-vera-api.up.railway.app/api/chat
QWEN_MODEL=qwen3-30b
PORT=8080
NODE_ENV=production
```

## Steps to Fix Railway Deployment

### 1. Go to Railway Dashboard
- Visit: https://railway.app/project/your-project-id
- Click on your VERA project

### 2. Set Environment Variables
- Click "Variables" tab
- Add each variable:
  - **Name:** `VERA_API_URL` **Value:** `https://qwen-vera-api.up.railway.app/api/chat`
  - **Name:** `QWEN_MODEL` **Value:** `qwen3-30b`
  - **Name:** `NODE_ENV` **Value:** `production`
  - **Name:** `PORT` **Value:** `8080`

### 3. Redeploy
- Railway will automatically redeploy after setting variables
- Or manually trigger: click "Deploy" → "Redeploy"

## Alternative: Quick CLI Fix

If you have Railway CLI:
```bash
railway login
railway variables set VERA_API_URL=https://qwen-vera-api.up.railway.app/api/chat
railway variables set QWEN_MODEL=qwen3-30b
railway variables set NODE_ENV=production
railway variables set PORT=8080
```

## Verification
After deployment, check:
- Health endpoint: `https://your-app.up.railway.app/health`
- Should return: `{"status":"healthy","timestamp":"...","version":"1.0.0"}`

## Common Issues
1. **Missing VERA_API_URL** - App won't connect to Qwen API
2. **Wrong PORT** - Railway assigns random port if not set
3. **Missing NODE_ENV** - May affect Express configuration

---
**Status:** Ready for immediate deployment once environment variables are set! 🎯