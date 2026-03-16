# 🌾 Fieldworker App - Complete Project Structure

## 📱 Project Overview

**Fieldworker App** is an offline-first mobile application for agriculture extension workers to collect and manage farmer data even without internet connectivity. Data automatically syncs when connection is available.

---

## 🏗️ Complete Project Structure

```
FarmerCropApp/
│
├── frontend_flutter/                    # Flutter Mobile App
│   ├── lib/
│   │   ├── main.dart                   # App entry point
│   │   │
│   │   ├── core/                       # Core utilities
│   │   │   ├── constants/
│   │   │   │   └── app_constants.dart  # App-wide constants
│   │   │   ├── utils/
│   │   │   │   ├── network_checker.dart # Connectivity check
│   │   │   │   ├── validators.dart      # Form validators
│   │   │   │   └── helpers.dart         # Helper functions
│   │   │   └── services/
│   │   │       ├── api_service.dart     # HTTP client
│   │   │       └── sync_service.dart    # Background sync
│   │   │
│   │   ├── data/                       # Data layer
│   │   │   ├── models/
│   │   │   │   ├── user_model.dart
│   │   │   │   ├── farmer_model.dart
│   │   │   │   └── crop_model.dart
│   │   │   │
│   │   │   ├── local/                  # SQLite database
│   │   │   │   ├── local_database.dart
│   │   │   │   ├── farmer_dao.dart
│   │   │   │   └── crop_dao.dart
│   │   │   │
│   │   │   └── repositories/
│   │   │       ├── auth_repository.dart
│   │   │       ├── farmer_repository.dart
│   │   │       └── crop_repository.dart
│   │   │
│   │   ├── presentation/               # UI layer
│   │   │   ├── screens/
│   │   │   │   ├── login_screen.dart
│   │   │   │   ├── register_screen.dart
│   │   │   │   ├── dashboard_screen.dart
│   │   │   │   ├── farmer_registration_screen.dart
│   │   │   │   ├── farmers_list_screen.dart
│   │   │   │   ├── crop_entry_screen.dart
│   │   │   │   └── sync_status_screen.dart
│   │   │   │
│   │   │   ├── widgets/
│   │   │   │   └── farmer_card.dart
│   │   │   │
│   │   │   └── providers/              # State management
│   │   │       ├── auth_provider.dart
│   │   │       ├── farmer_provider.dart
│   │   │       └── crop_provider.dart
│   │   │
│   │   └── routes/
│   │       └── app_routes.dart         # Navigation
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   └── pubspec.yaml                    # Dependencies
│
├── backend/                            # Node.js Backend
│   ├── config/
│   │   ├── db.js                      # MongoDB connection
│   │   └── env.js                     # Environment config
│   │
│   ├── controllers/
│   │   ├── authController.js          # Auth logic
│   │   ├── farmerController.js        # Farmer CRUD
│   │   ├── cropController.js          # Crop CRUD
│   │   └── syncController.js          # Sync logic
│   │
│   ├── models/
│   │   ├── User.js                    # User schema
│   │   ├── Farmer.js                  # Farmer schema
│   │   └── Crop.js                    # Crop schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── farmerRoutes.js
│   │   ├── cropRoutes.js
│   │   └── syncRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js          # JWT verification
│   │
│   ├── src/
│   │   └── app.js                     # Express app
│   │
│   ├── server.js                      # Entry point
│   ├── package.json
│   └── .env.example
│
└── Documentation files...
```

---

## 🎨 UI Screens Implemented

### 1. **Login Screen**
- Beautiful gradient background
- Email and password fields with validation
- Link to registration
- JWT token authentication

### 2. **Registration Screen**
- User registration form
- Name, email, password fields
- Form validation
- Auto-login after registration

### 3. **Dashboard Screen**
- Grid layout with 4 cards:
  - View Farmers
  - Add Farmer
  - View Crops
  - Sync Status
- Logout button
- Sync button in app bar

### 4. **Farmer Registration Screen**
- Farmer details form:
  - Name
  - Village
  - Mobile number
  - Address (optional)
- Offline-first: Saves locally first
- Auto-syncs when online

### 5. **Farmers List Screen**
- List of all registered farmers
- Shows sync status (SYNCED/PENDING)
- Tap to add crops for farmer
- Floating action button to add new farmer

### 6. **Crop Entry Screen**
- Crop details form:
  - Crop name
  - Crop type (dropdown)
  - Area in acres
  - Season (Kharif/Rabi/Zaid)
  - Sowing date (date picker)
- Linked to specific farmer

### 7. **Sync Status Screen**
- Shows online/offline status
- Manual sync button
- Sync progress indicator
- Auto-sync info

---

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI
npm run dev
```

### Frontend Setup

```bash
cd frontend_flutter
flutter pub get
# Update API URL in lib/core/constants/app_constants.dart
flutter run
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Farmers
- `POST /api/farmers` - Create farmer
- `GET /api/farmers` - Get all farmers
- `GET /api/farmers/:id` - Get single farmer
- `PUT /api/farmers/:id` - Update farmer
- `DELETE /api/farmers/:id` - Delete farmer

### Crops
- `POST /api/crops` - Create crop
- `GET /api/crops` - Get all crops
- `GET /api/crops/farmer/:farmerId` - Get crops by farmer
- `PUT /api/crops/:id` - Update crop
- `DELETE /api/crops/:id` - Delete crop

### Sync
- `POST /api/sync/sync` - Sync offline data

---

## 🗄️ Database Schema

### MongoDB Collections

**Users:**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (fieldworker/admin)
}
```

**Farmers:**
```javascript
{
  name: String,
  village: String,
  mobile: String,
  address: String,
  latitude: Number,
  longitude: Number,
  syncStatus: String (SYNCED/PENDING),
  createdBy: ObjectId (User)
}
```

**Crops:**
```javascript
{
  farmerId: ObjectId (Farmer),
  cropName: String,
  cropType: String,
  area: Number,
  season: String,
  sowingDate: Date,
  imagePath: String,
  syncStatus: String,
  createdBy: ObjectId (User)
}
```

### SQLite Tables (Local)

**farmers:**
- id, name, village, mobile, address, latitude, longitude, syncStatus, createdAt

**crops:**
- id, farmerId, cropName, cropType, area, season, sowingDate, imagePath, syncStatus

---

## 🔧 Tech Stack

### Frontend
- **Flutter** - Cross-platform framework
- **Provider** - State management
- **SQLite** - Local database
- **Dio** - HTTP client
- **WorkManager** - Background sync
- **Connectivity Plus** - Network detection

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

---

## ✨ Key Features

✅ **Offline-First Architecture**
- Works without internet
- Local SQLite database
- Automatic background sync

✅ **Beautiful UI**
- Material Design 3
- Gradient backgrounds
- Card-based layouts
- Responsive design

✅ **Complete CRUD Operations**
- Create, Read, Update, Delete
- For both Farmers and Crops

✅ **Authentication**
- JWT token-based
- Secure password hashing
- Protected routes

✅ **Background Sync**
- Syncs every 15 minutes
- Manual sync option
- Conflict resolution

✅ **Form Validation**
- Email validation
- Phone number validation
- Required field checks

---

## 📱 Screenshots Description

1. **Login Screen** - Green gradient with app logo
2. **Dashboard** - 4 colorful cards in grid
3. **Farmer Registration** - Clean form with icons
4. **Farmers List** - Cards with sync status badges
5. **Crop Entry** - Dropdown selectors and date picker
6. **Sync Status** - Cloud icon showing connection status

---

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS enabled

---

## 📦 Installation Requirements

- Node.js v18+
- Flutter v3.0+
- MongoDB Atlas account
- Android Studio / Xcode

---

## 🎯 Use Cases

- Farmer registration in rural areas
- Crop data collection
- Offline data entry
- Government scheme monitoring
- Agricultural surveys

---

## 📞 Support

For issues or questions, refer to:
- README.md
- QUICKSTART.md
- SETUP_CHECKLIST.md

---

**Built with ❤️ for Agriculture Extension Workers**
