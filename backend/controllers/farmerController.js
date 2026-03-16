const Farmer = require('../models/Farmer');

exports.createFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, message: 'Farmer created', data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllFarmers = async (req, res) => {
  try {
    const { search, village, page = 1, limit = 10 } = req.query;
    const query = { createdBy: req.user.id };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (village) {
      query.village = { $regex: village, $options: 'i' };
    }
    
    const farmers = await Farmer.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await Farmer.countDocuments(query);
    
    res.json({ 
      success: true, 
      data: farmers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, message: 'Farmer updated', data: farmer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, message: 'Farmer deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
