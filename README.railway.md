# VERA Marketing Intelligence - Railway Deployment

This project is ready for deployment on Railway.

## Environment Variables

Set these in your Railway dashboard:

- `PORT` - Automatically set by Railway
- `NODE_ENV` - Set to "production"
- `VERA_USE_AI` - Set to "false" (or "true" if you want AI features)
- `QWEN_BASE_URL` - Only needed if using external AI service

## Files

- `package.json` - Contains all dependencies and scripts
- `Procfile` - Tells Railway how to start the app
- `railway.json` - Railway configuration
- `public/` - Static web assets
- All VERA modules and consciousness

## Auto-Deploy

This app will auto-deploy when pushed to your connected Git repository.