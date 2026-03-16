const express = require('express');
const cors = require('cors');

const authRoutes = require('../routes/authRoutes');
const farmerRoutes = require('../routes/farmerRoutes');
const cropRoutes = require('../routes/cropRoutes');
const syncRoutes = require('../routes/syncRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/sync', syncRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

module.exports = app;
