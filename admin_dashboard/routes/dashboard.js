const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001/api';

// Middleware to check if admin is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session.adminToken) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Login page
router.get('/login', (req, res) => {
  if (req.session.adminToken) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null });
});

// Login POST
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    console.log(response);
    if (response.data.success) {
      req.session.adminToken = response.data.data.token;
      req.session.adminUser = response.data.data.user;
      res.redirect('/dashboard');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  } catch (error) {
      console.log(error);
    res.render('login', { error: 'Login failed. Please try again.' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Dashboard
router.get(['/', '/dashboard'], isAuthenticated, async (req, res) => {
  try {
    const token = req.session.adminToken;
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch all data
    const [usersRes, farmersRes, cropsRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/auth/users`, { headers }).catch(() => ({ data: { data: [] } })),
      axios.get(`${API_BASE_URL}/farmers`, { headers }),
      axios.get(`${API_BASE_URL}/crops`, { headers })
    ]);

    const farmers = farmersRes.data.data || [];
    const crops = cropsRes.data.data || [];
    const users = usersRes.data.data || [];

    // Calculate statistics
    const stats = {
      totalUsers: users.length || 1,
      totalFarmers: farmers.length,
      totalCrops: crops.length,
      syncedFarmers: farmers.filter(f => f.syncStatus === 'SYNCED').length,
      pendingFarmers: farmers.filter(f => f.syncStatus === 'PENDING').length
    };

    // Group crops by farmer
    const farmerCropsMap = {};
    crops.forEach(crop => {
      if (!farmerCropsMap[crop.farmerId]) {
        farmerCropsMap[crop.farmerId] = [];
      }
      farmerCropsMap[crop.farmerId].push(crop);
    });

    res.render('dashboard', {
      user: req.session.adminUser,
      stats,
      farmers,
      crops,
      farmerCropsMap
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.render('dashboard', {
      user: req.session.adminUser,
      stats: { totalUsers: 0, totalFarmers: 0, totalCrops: 0, syncedFarmers: 0, pendingFarmers: 0 },
      farmers: [],
      crops: [],
      farmerCropsMap: {}
    });
  }
});

// Farmers page
router.get('/farmers', isAuthenticated, async (req, res) => {
  try {
    const token = req.session.adminToken;
    const response = await axios.get(`${API_BASE_URL}/farmers`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.render('farmers', {
      user: req.session.adminUser,
      farmers: response.data.data || []
    });
  } catch (error) {
    res.render('farmers', {
      user: req.session.adminUser,
      farmers: []
    });
  }
});

// Crops page
router.get('/crops', isAuthenticated, async (req, res) => {
  try {
    const token = req.session.adminToken;
    const [cropsRes, farmersRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/crops`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${API_BASE_URL}/farmers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ]);

    const crops = cropsRes.data.data || [];
    const farmers = farmersRes.data.data || [];
    
    // Create farmer lookup
    const farmerMap = {};
    farmers.forEach(f => {
      farmerMap[f._id] = f;
    });

    res.render('crops', {
      user: req.session.adminUser,
      crops,
      farmerMap
    });
  } catch (error) {
    res.render('crops', {
      user: req.session.adminUser,
      crops: [],
      farmerMap: {}
    });
  }
});

module.exports = router;
