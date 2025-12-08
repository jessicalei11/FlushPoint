const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  bathroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bathroom',
    required: true,
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: 500,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ReviewSchema.index({ bathroom: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);