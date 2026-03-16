const Crop = require('../models/Crop');
const sharp = require('sharp');
const path = require('path');

exports.createCrop = async (req, res) => {
  try {
      console.log("BODY:", req.body);
    let imagePath = null;
    
    if (req.file) {
      const compressedPath = `uploads/crop_images/compressed-${req.file.filename}`;
      await sharp(req.file.path)
        .resize(800, 600, { fit: 'inside' })
        .jpeg({ quality: 80 })
        .toFile(compressedPath);
      imagePath = compressedPath;
    }
    
    const crop = await Crop.create({ 
      ...req.body, 
      imagePath,
      createdBy: req.user.id 
    });
      console.log("Saved Crop:", crop);

    res.status(201).json({ success: true, message: 'Crop created', data: crop });


  } catch (error) {
      console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ createdBy: req.user.id }).populate('farmerId');
    res.json({ success: true, data: crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCropsByFarmer = async (req, res) => {
  try {
    const crops = await Crop.find({ farmerId: req.params.farmerId });
    res.json({ success: true, data: crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    res.json({ success: true, message: 'Crop updated', data: crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    res.json({ success: true, message: 'Crop deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
