# Deployment Guide for Dokploy

This guide covers deploying your Mini app (React frontend + Hono backend) to Dokploy using Docker Compose.

## 🏗️ Architecture Options

You have **two deployment options**:

### **Option 1: Single Container (Recommended)**
- ✅ **Simpler setup**: One container serves both API and frontend
- ✅ **Lower resource usage**: ~384MB RAM total
- ✅ **Easier management**: Single deployment, single domain
- ✅ **Your current setup**: Hono already serves static files with `serveStatic`

**Files**: `docker-compose.single.yml` + `apps/server/Dockerfile.combined`

### **Option 2: Separate Containers**
- ✅ **Better separation**: Independent scaling of frontend/backend
- ✅ **Nginx optimizations**: Better static file serving, caching, compression
- ✅ **Resource isolation**: Frontend and backend can have different limits

**Files**: `docker-compose.yml` + separate Dockerfiles

## 🚀 Quick Deployment

### Prerequisites

1. **Dokploy Server**: Ensure you have Dokploy installed on your VPS
2. **Domain Setup**: Point your A records to your VPS IP:
   - `yourdomain.com` → Your VPS IP
   - `api.yourdomain.com` → Your VPS IP (or use path-based routing)
3. **Environment Variables**: Set up your production environment variables

### Step 1: Choose Your Architecture

**For Single Container (Recommended):**
- Use `docker-compose.single.yml`
- Set Compose Path to `./docker-compose.single.yml` in Dokploy
- Your Hono server will serve both API (`/api/*`) and frontend (`/*`)

**For Separate Containers:**
- Use `docker-compose.yml`
- Set Compose Path to `./docker-compose.yml` in Dokploy

### Step 2: Prepare Your Repository

1. **Update Domain Configuration**
   
   Replace `yourdomain.com` in your chosen compose file with your actual domain:
   ```yaml
   # Update these labels in the docker-compose.yml file:
   - "traefik.http.routers.mini-web.rule=Host(`yourdomain.com`) || Host(`www.yourdomain.com`)"
   - "traefik.http.routers.mini-api.rule=Host(`api.yourdomain.com`) || (Host(`yourdomain.com`) && PathPrefix(`/api`))"
   ```

2. **Environment Variables**
   
   Create a `.env` file in your project root with:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@host:port/database
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key
   DYNAMIC_PUBLIC_KEY=your-dynamic-public-key
   
   # AWS S3
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-bucket-name
   
   # Firebase
   FIREBASE_PRIVATE_KEY=your-firebase-private-key
   FIREBASE_CLIENT_EMAIL=your-firebase-client-email
   FIREBASE_PROJECT_ID=your-firebase-project-id
   
   # Server Configuration
   PORT=3001
   NODE_ENV=production
   
   # Frontend Build Variables
   VITE_API_URL=https://api.yourdomain.com
   VITE_APP_URL=https://yourdomain.com
   ```

### Step 2: Deploy to Dokploy

1. **Create New Project**
   - Log into your Dokploy dashboard
   - Create a new project (e.g., "mini-app")

2. **Create Docker Compose Service**
   - Click "Create Service" → "Docker Compose"
   - Select your Git provider (GitHub/GitLab/etc.)
   - Choose your repository
   - Set branch to `main`
   - Set Compose Path to `./docker-compose.yml`

3. **Configure Environment Variables**
   - In the Dokploy interface, add all your environment variables
   - Dokploy will create a `.env` file automatically

4. **Deploy**
   - Click "Deploy" and wait for the build process
   - Monitor logs for any issues
   - SSL certificates will be generated automatically by Traefik

## 🏗️ Architecture Overview

### Multi-Stage Builds

**Server (Hono + Bun):**
1. **deps**: Turbo prune to create minimal dependency tree
2. **installer**: Install dependencies and build the server
3. **runner**: Minimal production image with only built assets

**Web (React + Vite):**
1. **deps**: Turbo prune for web workspace
2. **builder**: Install dependencies and build static assets
3. **runner**: Nginx serving optimized static files

### Performance Optimizations

- **Turbo Prune**: Reduces Docker context by ~70-90%
- **Multi-stage builds**: Minimal final images
- **Nginx optimizations**: Gzip, caching, security headers
- **Health checks**: Automatic container health monitoring
- **Resource limits**: Memory constraints for optimal VPS usage

## 🔧 Configuration Details

### Traefik Labels Explained

**Web Service:**
```yaml
# Main domain routing
- "traefik.http.routers.mini-web.rule=Host(`yourdomain.com`) || Host(`www.yourdomain.com`)"

# SSL certificate generation
- "traefik.http.routers.mini-web.tls.certResolver=letsencrypt"

# WWW to non-WWW redirect
- "traefik.http.middlewares.mini-web-redirect.redirectregex.regex=^https://www\\.yourdomain\\.com/(.*)"
```

**API Service:**
```yaml
# API subdomain or path-based routing
- "traefik.http.routers.mini-api.rule=Host(`api.yourdomain.com`) || (Host(`yourdomain.com`) && PathPrefix(`/api`))"

# CORS configuration for frontend
- "traefik.http.middlewares.mini-api-cors.headers.accesscontrolalloworiginlist=https://yourdomain.com"
```

### Routing Options

Choose one of these approaches:

**Option 1: Subdomain (Recommended)**
- Frontend: `https://yourdomain.com`
- API: `https://api.yourdomain.com`

**Option 2: Path-based**
- Frontend: `https://yourdomain.com`
- API: `https://yourdomain.com/api`

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check if Turbo is building correctly locally
   bun run build
   
   # Verify Docker builds locally
   docker build -f apps/server/Dockerfile .
   docker build -f apps/web/Dockerfile .
   ```

2. **SSL Certificate Issues**
   - Ensure DNS A records point to your VPS
   - Wait 10-60 seconds after deployment for certificate generation
   - Check Traefik logs in Dokploy

3. **Environment Variables**
   - Verify all required env vars are set in Dokploy
   - Check that database connections are working
   - Ensure API URLs in frontend match your domain

4. **CORS Issues**
   - Update the CORS allowlist in docker-compose.yml
   - Ensure frontend and backend domains match

### Monitoring

- **Logs**: Use Dokploy's log viewer for each service
- **Health Checks**: Built-in health checks monitor service status
- **Resource Usage**: Monitor memory/CPU in Dokploy dashboard

## 🔄 Updates and CI/CD

### Manual Updates
- Push changes to your repository
- Click "Deploy" in Dokploy dashboard

### Automatic Deployments
- Dokploy provides webhooks for automatic deployments
- Configure in your Git provider settings

### Rolling Updates
- Dokploy handles zero-downtime deployments
- Previous containers remain running until new ones are healthy

## 📊 Performance Metrics

### Expected Build Times
- **Server**: ~2-3 minutes
- **Web**: ~3-4 minutes
- **Total**: ~5-7 minutes

### Image Sizes
- **Server**: ~150-200MB (vs ~800MB+ without optimization)
- **Web**: ~50-80MB (vs ~400MB+ without optimization)

### Resource Usage
- **Server**: 256MB RAM (512MB limit)
- **Web**: 64MB RAM (128MB limit)

## 🔐 Security Features

- Non-root users in containers
- Security headers via Traefik
- Automatic SSL/TLS certificates
- Network isolation via dokploy-network
- Environment variable encryption in Dokploy

---

For more information, visit the [Dokploy Documentation](https://docs.dokploy.com).
