const Farmer = require('../models/Farmer');

exports.syncFarmers = async (req, res) => {
  try {
    const { farmers } = req.body;
    const synced = [];
    
    for (const farmer of farmers) {
      const newFarmer = await Farmer.create({ ...farmer, createdBy: req.user.id });
      synced.push(newFarmer);
    }
    
    res.json({
      success: true,
      message: 'Sync completed',
      data: { syncedFarmers: synced }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
