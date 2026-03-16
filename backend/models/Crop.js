const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  cropName: { type: String, required: true },
  cropType: { type: String, required: true },
  area: { type: Number, required: true },
  season: { type: String, required: true },
  sowingDate: { type: Date, required: true },
  imagePath: { type: String },
  syncStatus: { type: String, enum: ['SYNCED', 'PENDING'], default: 'SYNCED' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Crop', cropSchema);
