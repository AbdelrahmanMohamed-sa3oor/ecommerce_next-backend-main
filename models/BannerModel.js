const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Banner name is required'],
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  link: {
    type: String,
  },
  bannerType: {
    type: [String],
    enum: ['static', 'dynamic', 'extra'],
    default: 'dynamic',
    required: [true, 'Banner type is required'],
  },
  intervalHours: {
    type: Number,
    required: function () {
      return this.bannerType === 'dynamic';
    },
    default:12
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Banner', bannerSchema);
