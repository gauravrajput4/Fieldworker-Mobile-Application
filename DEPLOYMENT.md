# 🚀 Deployment Guide - Farmer Crop App

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Environment variables configured
- [ ] API tested locally
- [ ] Flutter app tested on device
- [ ] Security review completed

---

## ☁️ Backend Deployment Options

### Option 1: AWS EC2 (Recommended for Production)

1. **Launch EC2 Instance:**
   - Ubuntu 22.04 LTS
   - t2.micro (Free tier eligible)
   - Open ports: 22 (SSH), 5000 (API)

2. **Setup Server:**
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone your repo
git clone your-repo-url
cd FarmerCropApp/backend

# Install dependencies
npm install --production

# Create .env file
nano .env
# Add production values

# Start with PM2
pm2 start server.js --name farmer-api
pm2 startup
pm2 save
```

3. **Setup Nginx (Optional):**
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/farmer-api

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

sudo ln -s /etc/nginx/sites-available/farmer-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 2: Heroku (Quick Deploy)

1. **Install Heroku CLI:**
```bash
npm install -g heroku
```

2. **Deploy:**
```bash
cd backend
heroku login
heroku create farmer-crop-api
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-secret"
git push heroku main
```

### Option 3: Railway.app (Easiest)

1. Go to https://railway.app
2. Connect GitHub repo
3. Select backend folder
4. Add environment variables
5. Deploy automatically

---

## 📱 Flutter App Deployment

### Android APK Build

1. **Update API URL:**
```dart
// lib/core/config/app_config.dart
static const String baseUrl = 'https://your-production-api.com/api';
```

2. **Build APK:**
```bash
flutter build apk --release
```

3. **APK Location:**
```
build/app/outputs/flutter-apk/app-release.apk
```

### Android App Bundle (For Play Store)

```bash
flutter build appbundle --release
```

### iOS Build

```bash
flutter build ios --release
```

---

## 🔐 Production Security Checklist

### Backend
- [ ] Change JWT_SECRET to strong random string
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for specific domains only
- [ ] Enable MongoDB IP whitelist
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Add request logging
- [ ] Set up monitoring (e.g., PM2 monitoring)

### Frontend
- [ ] Remove debug logs
- [ ] Obfuscate code: `flutter build apk --obfuscate --split-debug-info=build/debug-info`
- [ ] Add ProGuard rules (Android)
- [ ] Configure app permissions properly
- [ ] Test offline functionality thoroughly

---

## 📊 MongoDB Atlas Production Setup

1. **Upgrade Cluster (if needed):**
   - M10 or higher for production
   - Enable automatic backups
   - Set up monitoring alerts

2. **Security:**
   - Create separate database user for production
   - Use strong password
   - Whitelist only production server IPs
   - Enable audit logs

3. **Performance:**
   - Create indexes:
```javascript
db.farmers.createIndex({ createdBy: 1, updatedAt: -1 })
db.farmers.createIndex({ mobile: 1 })
db.syncmetadata.createIndex({ deviceId: 1, lastSync: -1 })
```

---

## 🔍 Monitoring & Logging

### Backend Monitoring

1. **PM2 Monitoring:**
```bash
pm2 monit
pm2 logs farmer-api
```

2. **Setup Alerts:**
```bash
pm2 install pm2-logrotate
```

### Application Monitoring (Optional)

- **New Relic**: Application performance monitoring
- **Sentry**: Error tracking
- **LogRocket**: Session replay

---

## 🧪 Production Testing

### API Health Check
```bash
curl https://your-api.com/health
```

### Load Testing
```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test 1000 requests, 10 concurrent
ab -n 1000 -c 10 https://your-api.com/api/farmers
```

---

## 📈 Scaling Strategy

### Horizontal Scaling
- Use AWS Load Balancer
- Deploy multiple EC2 instances
- Use Redis for session management

### Database Scaling
- MongoDB Atlas auto-scaling
- Read replicas for read-heavy operations
- Sharding for large datasets

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy Backend

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to EC2
        run: |
          ssh -i ${{ secrets.EC2_KEY }} ubuntu@${{ secrets.EC2_HOST }} '
            cd FarmerCropApp/backend &&
            git pull &&
            npm install &&
            pm2 restart farmer-api
          '
```

---

## 📞 Post-Deployment

1. **Monitor for 24 hours:**
   - Check error logs
   - Monitor API response times
   - Verify sync functionality

2. **User Testing:**
   - Test with real fieldworkers
   - Collect feedback
   - Fix critical issues

3. **Documentation:**
   - Update API documentation
   - Create user manual
   - Train fieldworkers

---

## 🆘 Troubleshooting

### API Not Responding
```bash
pm2 logs farmer-api
sudo systemctl status nginx
```

### Database Connection Issues
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check network connectivity

### App Sync Issues
- Verify API URL in app
- Check device internet connection
- Review sync logs in app

---

## 📝 Maintenance

### Regular Tasks
- [ ] Weekly: Check error logs
- [ ] Monthly: Review database performance
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Quarterly: Backup verification

---

## 🎉 Deployment Complete!

Your Farmer Crop App is now live and ready to help fieldworkers manage farmer data offline!

**Production URL:** https://your-api.com
**App Version:** 1.0.0
**Deployment Date:** [Add date]

---

## 📧 Support

For deployment issues, contact: your-email@example.com
