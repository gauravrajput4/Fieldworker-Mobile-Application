const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/sync', syncController.syncFarmers);

module.exports = router;
