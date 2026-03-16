const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmerController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', farmerController.createFarmer);
router.get('/', farmerController.getAllFarmers);
router.get('/:id', farmerController.getFarmer);
router.put('/:id', farmerController.updateFarmer);
router.delete('/:id', farmerController.deleteFarmer);

module.exports = router;
