# Farmer Crop App - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: MongoDB Atlas Setup (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (Free tier M0)
4. Create database user (username + password)
5. Whitelist IP: `0.0.0.0/0` (Allow from anywhere)
6. Get connection string

### Step 2: Backend Setup (2 minutes)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB URI
npm run dev
```

### Step 3: Flutter Setup (1 minute)

```bash
cd frontend_flutter
flutter pub get
# Update baseUrl in lib/core/config/app_config.dart
flutter run
```

## ✅ Verify Installation

1. Backend: http://localhost:5000/health
2. Flutter app should launch on emulator/device

## 🎯 First API Test

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

## 📱 App Features to Test

1. Register/Login
2. Add farmer (offline)
3. Turn off internet
4. Add more farmers
5. Turn on internet
6. Watch auto-sync happen!

## 🐛 Common Issues

**MongoDB Connection Failed:**
- Check MONGODB_URI in .env
- Verify IP whitelist in Atlas
- Check username/password

**Flutter Build Failed:**
- Run `flutter clean`
- Run `flutter pub get`
- Check Flutter version: `flutter --version`

**Sync Not Working:**
- Check network permissions in AndroidManifest.xml
- Verify API URL is correct (use IP, not localhost)

## 📞 Need Help?

Check README.md for detailed documentation.
