# Housing Allocation System - Render Deployment

## 🚀 Quick Deploy to Render

This project is ready for deployment on Render.com. Follow these steps:

### 1. Connect Repository

- Go to [dashboard.render.com](https://dashboard.render.com)
- Click "New" → "Blueprint"
- Connect your GitHub repository
- Select the `render.yaml` file when prompted

### 2. Environment Variables

#### Server Service (`housing-server`)

Set these environment variables in your Render dashboard:

```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_ORIGIN=https://your-client-app.onrender.com
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=Your App Name
OPENAI_API_KEY=your-openai-api-key (optional)
NODE_ENV=production
```

#### Client Service (`housing-client`)

```
NEXT_PUBLIC_API_URL=https://your-server-app.onrender.com
GEMINI_API_KEY=your-gemini-api-key (optional)
```

### 3. Database Setup

- Render will automatically create a PostgreSQL database
- Copy the `DATABASE_URL` from the database service
- Run database migrations: `npm run db:migrate` in the server service

### 4. Deploy

- Click "Apply" in Render to deploy both services
- The client will be available at: `https://your-client-app.onrender.com`
- The API will be available at: `https://your-server-app.onrender.com`

### 5. Post-Deployment

- Update `FRONTEND_ORIGIN` in server env vars to match your deployed client URL
- Redeploy the server service
- Test the application login and basic functionality

## 📁 Project Structure

- `server/` - Express.js API backend
- `client/` - Next.js frontend
- `render.yaml` - Render deployment configuration
- `docs/` - Additional documentation

## 🔧 Local Development

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

## 📋 Checklist

- [ ] Repository connected to Render
- [ ] Environment variables configured
- [ ] Database created and connected
- [ ] Services deployed successfully
- [ ] CORS origin updated to production URL
- [ ] Application tested in production
