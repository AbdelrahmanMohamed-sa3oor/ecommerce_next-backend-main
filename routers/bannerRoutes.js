// routes/bannerRoutes.js
const express = require('express');
const router = express.Router();
const BannerController = require('../controller/bannerController');

// Create new banner
router.post('/', BannerController.createBanner);

// Get all banners
router.get('/', BannerController.getAllBanners);

// Get active banners (filtered by current date)
router.get('/active', BannerController.getActiveBanners);

// Get one banner by ID
router.get('/:id', BannerController.getBannerById);

// Update banner
router.put('/:id', BannerController.updateBanner);

// Delete banner
router.delete('/:id', BannerController.deleteBanner);

module.exports = router;
