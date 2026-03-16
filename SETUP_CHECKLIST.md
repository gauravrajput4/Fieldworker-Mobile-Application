╔══════════════════════════════════════════════════════════════════════════════╗
║                  FARMER CROP APP - SETUP CHECKLIST                           ║
║                     Complete This Before Running                             ║
╚══════════════════════════════════════════════════════════════════════════════╝

📋 PRE-REQUISITES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Node.js v18+ installed
  → Check: node --version
  → Download: https://nodejs.org

□ Flutter v3.0+ installed
  → Check: flutter --version
  → Download: https://flutter.dev/docs/get-started/install

□ MongoDB Atlas account created
  → Sign up: https://www.mongodb.com/cloud/atlas

□ Git installed (optional)
  → Check: git --version

□ Code editor (VS Code recommended)
  → Download: https://code.visualstudio.com


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🗄️ MONGODB ATLAS SETUP (5 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Step 1: Create MongoDB Atlas Account
  → Go to: https://www.mongodb.com/cloud/atlas
  → Click "Try Free"
  → Sign up with email

□ Step 2: Create New Cluster
  → Click "Build a Database"
  → Select "M0 FREE" tier
  → Choose cloud provider (AWS recommended)
  → Select region (closest to you)
  → Click "Create Cluster"

□ Step 3: Create Database User
  → Go to "Database Access"
  → Click "Add New Database User"
  → Username: farmercrop_user
  → Password: [Generate strong password]
  → User Privileges: "Read and write to any database"
  → Click "Add User"

□ Step 4: Whitelist IP Address
  → Go to "Network Access"
  → Click "Add IP Address"
  → Click "Allow Access from Anywhere" (0.0.0.0/0)
  → Click "Confirm"

□ Step 5: Get Connection String
  → Go to "Database" → "Connect"
  → Select "Connect your application"
  → Copy connection string
  → Format: mongodb+srv://<username>:<password>@cluster.mongodb.net/farmercrop
  → Replace <username> and <password> with your credentials


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 BACKEND SETUP (3 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Step 1: Navigate to backend directory
  → cd /Users/apple/WorkSpace/FarmerCropApp/backend

□ Step 2: Install dependencies
  → npm install
  → Wait for installation to complete

□ Step 3: Create .env file
  → cp .env.example .env
  → Open .env in text editor

□ Step 4: Configure .env file
  → PORT=5000
  → MONGODB_URI=[Paste your MongoDB connection string]
  → JWT_SECRET=[Generate random string - use: openssl rand -base64 32]
  → JWT_EXPIRE=7d
  → NODE_ENV=development

□ Step 5: Verify configuration
  → Check all values are filled
  → No < > brackets in MongoDB URI
  → JWT_SECRET is at least 32 characters

□ Step 6: Start backend server
  → npm run dev
  → Should see: "Server running on port 5000"
  → Should see: "MongoDB Connected Successfully"

□ Step 7: Test API health
  → Open browser: http://localhost:5000/health
  → Should see: {"status":"OK","timestamp":"..."}


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 FLUTTER SETUP (3 minutes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Step 1: Navigate to Flutter directory
  → cd /Users/apple/WorkSpace/FarmerCropApp/frontend_flutter

□ Step 2: Install Flutter dependencies
  → flutter pub get
  → Wait for packages to download

□ Step 3: Update API URL
  → Open: lib/core/config/app_config.dart
  → Find: static const String baseUrl
  → For Android Emulator: 'http://10.0.2.2:5000/api'
  → For iOS Simulator: 'http://localhost:5000/api'
  → For Real Device: 'http://YOUR_COMPUTER_IP:5000/api'

□ Step 4: Get your computer IP (for real device)
  → macOS: ifconfig | grep "inet " | grep -v 127.0.0.1
  → Windows: ipconfig
  → Linux: ip addr show

□ Step 5: Connect device or start emulator
  → Check devices: flutter devices
  → Start emulator if needed

□ Step 6: Run the app
  → flutter run
  → Select device when prompted
  → Wait for app to build and launch


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧪 TESTING CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ Test 1: Backend Health Check
  → curl http://localhost:5000/health
  → Expected: {"status":"OK",...}

□ Test 2: Register User
  → curl -X POST http://localhost:5000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
  → Expected: {"success":true,"message":"Registration successful",...}

□ Test 3: Login User
  → curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}'
  → Expected: {"success":true,"data":{"token":"..."}}

□ Test 4: Flutter App Launches
  → App opens without errors
  → UI displays correctly

□ Test 5: Offline Mode
  → Turn off WiFi/Mobile data
  → Try creating farmer data
  → Should save locally

□ Test 6: Online Sync
  → Turn on internet
  → Wait 15 minutes or trigger manual sync
  → Data should sync to server


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🐛 TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Problem: MongoDB Connection Failed
□ Check MONGODB_URI in .env
□ Verify username and password are correct
□ Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0)
□ Ensure no < > brackets in connection string

Problem: Backend won't start
□ Check if port 5000 is already in use
□ Kill process: lsof -ti:5000 | xargs kill -9
□ Check Node.js version: node --version (should be 18+)
□ Delete node_modules and run: npm install

Problem: Flutter build failed
□ Run: flutter clean
□ Run: flutter pub get
□ Check Flutter version: flutter --version
□ Update Flutter: flutter upgrade

Problem: App can't connect to API
□ Check API URL in app_config.dart
□ For Android emulator, use: 10.0.2.2 instead of localhost
□ For real device, use computer's IP address
□ Ensure backend is running
□ Check firewall settings

Problem: Sync not working
□ Check internet connectivity
□ Verify API URL is correct
□ Check backend logs for errors
□ Ensure JWT token is valid


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 DOCUMENTATION REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ README.md - Complete documentation
□ QUICKSTART.md - 5-minute setup guide
□ DEPLOYMENT.md - Production deployment
□ PROJECT_STRUCTURE.txt - Architecture overview
□ ARCHITECTURE_DIAGRAM.txt - Visual diagrams
□ SUMMARY.txt - Project summary


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ COMPLETION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ MongoDB Atlas cluster created and configured
□ Backend .env file configured
□ Backend dependencies installed
□ Backend server running successfully
□ Flutter dependencies installed
□ Flutter app_config.dart updated with correct API URL
□ Flutter app running on device/emulator
□ API health check successful
□ User registration working
□ User login working
□ Offline data storage working
□ Online sync working


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 READY TO DEVELOP!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Once all items are checked, your Farmer Crop App is ready for development!

Next Steps:
1. Customize UI/UX as per requirements
2. Add more features (crop data, soil health, etc.)
3. Implement additional screens
4. Add data validation
5. Enhance error handling
6. Add analytics and monitoring
7. Prepare for production deployment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Built with ❤️ for Agriculture Extension Workers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
